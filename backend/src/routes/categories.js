const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesStats,
  reorderCategories
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/', getCategories);
router.get('/stats', getCategoriesStats);
router.get('/:slug', getCategoryBySlug);

// Rutas que requieren autenticación de admin
router.use(protect, authorize('admin'));

router.post('/', createCategory);
router.put('/reorder', reorderCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
