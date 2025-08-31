'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Cambiamos el ENUM para agregar "Variado"
    await queryInterface.changeColumn('libros', 'estado', {
      type: Sequelize.ENUM('Disponible', 'Prestado', 'Dañado', 'Baja', 'Variado'),
      allowNull: false,
      defaultValue: 'Disponible'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Volvemos a dejar el ENUM sin "Variado" si queremos revertir
    await queryInterface.changeColumn('libros', 'estado', {
      type: Sequelize.ENUM('Disponible', 'Prestado', 'Dañado', 'Baja'),
      allowNull: false,
      defaultValue: 'Disponible'
    });
  }
};

