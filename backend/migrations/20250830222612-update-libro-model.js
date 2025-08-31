'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Agregar campos de cantidad por estado
    await queryInterface.addColumn('libros', 'cantidadDisponible', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn('libros', 'cantidadPrestado', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('libros', 'cantidadDañado', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('libros', 'cantidadBaja', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // 2️⃣ Agregar campo actualizadoEn
    await queryInterface.addColumn('libros', 'actualizadoEn', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // 3️⃣ Modificar el ENUM estado para agregar nuevos valores
    await queryInterface.changeColumn('libros', 'estado', {
      type: Sequelize.ENUM("Disponible", "Prestado", "Dañado", "Baja", "Variado"),
      allowNull: false,
      defaultValue: "Disponible",
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios
    await queryInterface.removeColumn('libros', 'cantidadDisponible');
    await queryInterface.removeColumn('libros', 'cantidadPrestado');
    await queryInterface.removeColumn('libros', 'cantidadDañado');
    await queryInterface.removeColumn('libros', 'cantidadBaja');
    await queryInterface.removeColumn('libros', 'actualizadoEn');

    // Opcional: volver a enum antiguo
    await queryInterface.changeColumn('libros', 'estado', {
      type: Sequelize.ENUM("Disponible", "No disponible"),
      allowNull: false,
      defaultValue: "Disponible",
    });
  }
};
