const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Libro = sequelize.define('Libro', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    estado: {
      type: DataTypes.ENUM("Disponible", "No disponible"),
      defaultValue: "Disponible",
    },
    creadoEn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "libros",
    timestamps: false, // usamos nuestro campo creadoEn
  });

  return Libro;
};
