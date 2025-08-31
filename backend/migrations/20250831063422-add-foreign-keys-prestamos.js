'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('prestamos', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('prestamos', 'libro_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'libros',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('prestamos', 'usuario_id');
    await queryInterface.removeColumn('prestamos', 'libro_id');
  }
};
