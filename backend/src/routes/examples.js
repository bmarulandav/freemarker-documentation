const express = require('express');
const router = express.Router();
const {
  getExamples,
  getExampleBySlug,
  createExample,
  updateExample,
  deleteExample,
  likeExample,
  getPopularExamples,
  getFeaturedExamples,
  searchExamples
} = require('../controllers/exampleController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Rutas públicas
router.get('/', getExamples);
router.get('/popular', getPopularExamples);
router.get('/featured', getFeaturedExamples);
router.get('/search', searchExamples);

// Rutas que requieren autenticación opcional (para mejor UX)
router.post('/:id/like', optionalAuth, likeExample);

// Ruta para obtener ejemplo por slug (debe ir después de las rutas específicas)
router.get('/:slug', getExampleBySlug);

// Rutas que requieren autenticación
router.use(protect); // Todas las rutas de aquí en adelante requieren autenticación

// Crear ejemplo (usuarios autenticados)
router.post('/', createExample);

// Actualizar ejemplo (owner o admin)
router.put('/:id', updateExample);

// Eliminar ejemplo (owner o admin)
router.delete('/:id', deleteExample);

module.exports = router;
