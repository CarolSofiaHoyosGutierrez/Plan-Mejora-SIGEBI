const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // modelo sequelize

// ✅ Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'usuario', // si no envían rol, asigna "usuario"
    });

    res.json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);

    // Verificar si es error de email duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        mensaje: 'No se puede crear el usuario: el correo ya está registrado' 
      });
    }

    res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
  }
};

// ✅ Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en login', error: error.message });
  }
};

// ✅ Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// src/controllers/usuarioController.js
// ✅ Obtener datos del usuario autenticado
exports.perfil = async (req, res) => {
  try {
    // req.usuario viene del authMiddleware
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt', 'updatedAt']
    });

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener perfil", error: error.message });
  }
};

