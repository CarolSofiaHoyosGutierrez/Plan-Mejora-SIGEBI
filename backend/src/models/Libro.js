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
      validate: {
        min: 0,
      },
    },
    estado: {
      type: DataTypes.ENUM("Disponible", "Prestado", "Dañado", "Baja", "Variado"),
      allowNull: false,
      defaultValue: "Disponible",
    },
    cantidadDisponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 0,
      },
    },
    cantidadPrestado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    cantidadDañado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    cantidadBaja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
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
    tableName: "libros",
    timestamps: false,
    hooks: {
  beforeCreate: (libro) => {
    // Si no hay valores manuales, copia cantidad a cantidadDisponible
    if (libro.cantidadDisponible === undefined || libro.cantidadDisponible === null) {
      libro.cantidadDisponible = libro.cantidad;
    }

    // Calcular estado antes de guardar
    libro.estado = calcularEstado(libro);
  },
  beforeUpdate: (libro) => {
    // Recalcular estado siempre que se actualice
    libro.estado = calcularEstado(libro);
    libro.actualizadoEn = new Date();
  }
}

  });

  // Función auxiliar para calcular estado según las cantidades
  function calcularEstado(libro) {
  const { cantidadDisponible, cantidadPrestado, cantidadDañado, cantidadBaja, cantidad } = libro;

  // Asegurar que la suma no exceda la cantidad total
  const total = cantidadDisponible + cantidadPrestado + cantidadDañado + cantidadBaja;
  if (total !== cantidad) {
    // Ajustar automáticamente cantidadDisponible
    libro.cantidadDisponible = cantidad - (cantidadPrestado + cantidadDañado + cantidadBaja);
  }

  // Determinar estado
  if (libro.cantidadDisponible === cantidad && cantidadPrestado === 0 && cantidadDañado === 0 && cantidadBaja === 0) {
    return "Disponible";
  }
  if (libro.cantidadDisponible === 0 && cantidadPrestado === cantidad && cantidadDañado === 0 && cantidadBaja === 0) {
    return "Prestado";
  }
  if (libro.cantidadDisponible === 0 && cantidadPrestado === 0 && cantidadDañado === cantidad && cantidadBaja === 0) {
    return "Dañado";
  }
  if (libro.cantidadDisponible === 0 && cantidadPrestado === 0 && cantidadDañado === 0 && cantidadBaja === cantidad) {
    return "Baja";
  }
  return "Variado";
}

 return Libro;

};
