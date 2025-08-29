const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// ✅ Registro
router.post('/register', usuariosController.register);

// ✅ Login
router.post('/login', usuariosController.login);

// ✅ Listar todos
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todos los usuarios (solo con token válido)
router.get('/', authMiddleware, usuariosController.getUsuarios);

module.exports = router;
