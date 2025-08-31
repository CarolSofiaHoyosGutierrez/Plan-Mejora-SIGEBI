const { Sequelize } = require('sequelize');
const UsuarioModel = require('./Usuario');
const LibroModel = require('./Libro');
const PrestamoModel = require('./Prestamo');

// Configuración con variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

// Inicializamos el modelo Usuario
const Usuario = UsuarioModel(sequelize);
const Libro = LibroModel(sequelize);
const Prestamo = PrestamoModel(sequelize);

// Exportamos todo
module.exports = {
  sequelize,
  Usuario,
  Libro,
  Prestamo,
};
