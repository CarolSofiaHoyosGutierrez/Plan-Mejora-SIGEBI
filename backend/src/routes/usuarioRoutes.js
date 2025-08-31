const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
// ✅ Listar todos
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ✅ Registro
router.post('/register', usuariosController.register);

// ✅ Login
router.post('/login', usuariosController.login);

router.get('/usuarios-admin', authMiddleware, roleMiddleware('admin'), usuariosController.getUsuarios);

// nuevo:
router.get('/perfil', authMiddleware, usuariosController.perfil);

// Obtener todos los usuarios (solo con token válido)
router.get('/', authMiddleware, usuariosController.getUsuarios);

module.exports = router;
