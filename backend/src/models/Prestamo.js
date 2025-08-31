const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prestamo = sequelize.define('Prestamo', {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    libro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaPrestamo: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fechaVencimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Activo", "Devuelto", "Vencido"),
      allowNull: false,
      defaultValue: "Activo",
    },
    creadoEn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    actualizadoEn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "prestamos",
    timestamps: false,
    hooks: {
      beforeCreate: (prestamo) => {
        // fechaVencimiento = fechaPrestamo + 15 días
        if (!prestamo.fechaVencimiento) {
          const vencimiento = new Date(prestamo.fechaPrestamo);
          vencimiento.setDate(vencimiento.getDate() + 15);
          prestamo.fechaVencimiento = vencimiento;
        }
      },
      beforeUpdate: (prestamo) => {
        prestamo.actualizadoEn = new Date();
      }
    }
  });

  // Relaciones
  Prestamo.associate = (models) => {
    Prestamo.belongsTo(models.Usuario, { foreignKey: "usuario_id" });
    Prestamo.belongsTo(models.Libro, { foreignKey: "libro_id" });
  };

  return Prestamo;
};
