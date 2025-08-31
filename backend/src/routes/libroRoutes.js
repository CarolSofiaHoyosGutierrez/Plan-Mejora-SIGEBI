const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Solo admin puede registrar libros
router.post('/', authMiddleware, librosController.createLibro);

// Cualquier usuario autenticado puede ver el catálogo
router.get('/', authMiddleware, librosController.getLibros);

// Solo admin puede actualizar libros
router.put('/:id', authMiddleware, librosController.updateLibro);

// 👉 Nuevo: solicitar préstamo (lector)
router.post('/:id/prestar', authMiddleware, librosController.prestarLibro);

module.exports = router;
