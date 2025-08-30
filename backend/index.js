const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./src/routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const libroRoutes = require('./src/routes/libroRoutes');
app.use('/api/libros', libroRoutes);

const { sequelize } = require('./src/models');

// Probar conexión a la DB
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a MySQL correctamente'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

const Usuario = require('./src/models/Usuario');

sequelize.sync({ force: false }) // force:true borra y crea la tabla de nuevo
  .then(() => console.log('✅ Tablas sincronizadas con MySQL'))
  .catch(err => console.error('❌ Error al sincronizar tablas:', err));

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
