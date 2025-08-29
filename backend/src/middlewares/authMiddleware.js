// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para verificar token
const authMiddleware = (req, res, next) => {
  // Los tokens suelen enviarse en el header "Authorization: Bearer token"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // saca el token después de "Bearer "

  if (!token) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  try {
    // Verificar token con la misma clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario en la request (opcional)
    req.usuario = decoded;

    // Continuar hacia el siguiente middleware/controlador
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
