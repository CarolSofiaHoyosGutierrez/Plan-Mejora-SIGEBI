const { Libro } = require('../models');

// ✅ Registrar libro
exports.createLibro = async (req, res) => {
  try {
    const { titulo, autor, isbn, categoria, cantidad } = req.body;

    const nuevoLibro = await Libro.create({
      titulo,
      autor,
      isbn,
      categoria,
      cantidad,
      estado: "Disponible",
    });

    res.json({ mensaje: "Libro registrado exitosamente ✅", libro: nuevoLibro });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar libro", error: error.message });
  }
};

// ✅ Listar todos los libros
exports.getLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener libros", error: error.message });
  }
};
