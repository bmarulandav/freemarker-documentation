const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token existe en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token requerido'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'freemarker-docs-secret');

      // Obtener usuario actual
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado, usuario no encontrado'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada, contacta al administrador'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token inválido'
      });
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para autorizar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `No tienes permisos para acceder a este recurso. Rol requerido: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Middleware opcional - no falla si no hay token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'freemarker-docs-secret');
        const user = await User.findById(decoded.id);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Si el token es inválido, simplemente continúa sin usuario
        console.log('Token inválido en auth opcional:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Error en middleware de auth opcional:', error);
    next(); // Continúa aunque haya error
  }
};

// Middleware para verificar ownership o admin
const checkOwnershipOrAdmin = (resourceField = 'author.email') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Los admins pueden acceder a todo
    if (req.user.role === 'admin') {
      return next();
    }

    // Para otros casos, necesitamos verificar en el siguiente middleware
    // que tenga acceso al recurso específico
    req.checkOwnership = true;
    req.ownershipField = resourceField;
    next();
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnershipOrAdmin
};
