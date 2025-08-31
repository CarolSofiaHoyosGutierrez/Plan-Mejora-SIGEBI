const { Libro, Prestamo } = require('../models');


// ✅ Registrar libro
exports.createLibro = async (req, res) => {
  try {
    const { titulo, autor, isbn, categoria, cantidad } = req.body;

    // Creamos el libro con los valores iniciales
    const nuevoLibro = await Libro.create({
      titulo,
      autor,
      isbn,
      categoria,
      cantidad,
      cantidadDisponible: cantidad,  // al inicio todo está disponible
      cantidadPrestado: 0,
      cantidadDañado: 0,
      cantidadBaja: 0,
      // estado no lo fijamos aquí → lo define automáticamente el hook del modelo
    });

    res.status(201).json({
      mensaje: "📚 Libro registrado exitosamente",
      libro: nuevoLibro,
    });
  } catch (error) {
    console.error("❌ Error en createLibro:", error);
    res.status(500).json({
      mensaje: "Error al registrar libro",
      error: error.message,
    });
  }
};

// ✅ Listar todos los libros
exports.getLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll();
    res.status(200).json(libros);
  } catch (error) {
    console.error("❌ Error en getLibros:", error);
    res.status(500).json({
      mensaje: "Error al obtener libros",
      error: error.message,
    });
  }
};

// ✅ Actualizar libro por ID
exports.updateLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      autor,
      categoria,
      cantidad,
      cantidadDisponible,
      cantidadPrestado,
      cantidadDañado,
      cantidadBaja
    } = req.body;

    // Buscar libro por ID
    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    // Actualizar campos permitidos si vienen en el body
    if (titulo !== undefined) libro.titulo = titulo;
    if (autor !== undefined) libro.autor = autor;
    if (categoria !== undefined) libro.categoria = categoria;
    if (cantidad !== undefined) libro.cantidad = cantidad;
    if (cantidadDisponible !== undefined) libro.cantidadDisponible = cantidadDisponible;
    if (cantidadPrestado !== undefined) libro.cantidadPrestado = cantidadPrestado;
    if (cantidadDañado !== undefined) libro.cantidadDañado = cantidadDañado;
    if (cantidadBaja !== undefined) libro.cantidadBaja = cantidadBaja;

    await libro.save();

    res.json({ mensaje: "Libro actualizado ✅", libro });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar libro", error: error.message });
  }
};

// POST /api/libros/:id/prestar
// POST /api/libros/:id/prestar
exports.prestarLibro = async (req, res) => {
  try {
    console.log("Usuario:", req.usuario);
    console.log("ID del libro:", req.params.id);
    const libro_id = req.params.id;
    const usuario_id = req.usuario.id;

    const libro = await Libro.findByPk(libro_id);
    if (!libro) return res.status(404).json({ message: "Libro no encontrado" });

    if (libro.cantidadDisponible <= 0)
      return res.status(400).json({ message: "No hay copias disponibles" });

    const prestamo = await Prestamo.create({
  usuario_id,
  libro_id,
  fechaPrestamo: new Date(),
  fechaVencimiento: new Date(Date.now() + 15*24*60*60*1000), // +15 días
});


    libro.cantidadDisponible -= 1;
    libro.cantidadPrestado += 1;
    libro.estado = calcularEstado(libro);
    await libro.save();

    res.status(201).json(prestamo);
  } catch (error) {
    console.error("❌ Error al prestar libro:", error);
    if (error.parent) {
      console.error("SQL Error:", error.parent);
    }
    res.status(500).json({ message: "Error al procesar préstamo", error: error.message });
  } // <-- aquí cierra correctamente catch y try
}; // <-- ¡esta llave cierra toda la función prestarLibro!

// Función auxiliar para calcular estado (puedes tomar la tuya del modelo Libro)
function calcularEstado(libro) {
  const { cantidad, cantidadDisponible, cantidadPrestado, cantidadDañado, cantidadBaja } = libro;

  if (cantidadDisponible === cantidad) return "Disponible";
  if (cantidadDisponible === 0 && cantidadPrestado === cantidad) return "Prestado";
  if (cantidadDisponible === 0 && cantidadDañado === cantidad) return "Dañado";
  if (cantidadDisponible === 0 && cantidadBaja === cantidad) return "Baja";
  return "Variado";
}