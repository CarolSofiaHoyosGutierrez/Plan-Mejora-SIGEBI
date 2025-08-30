// Middleware que recibe roles permitidos
const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "No tienes permisos para acceder a esta ruta" });
    }
    next();
  };
};

module.exports = roleMiddleware;
