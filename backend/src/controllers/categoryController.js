const Category = require('../models/Category');
const Example = require('../models/Example');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { includeExamples = false, limit } = req.query;

    let query = Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    let categories = await query;

    // Si se solicita incluir ejemplos
    if (includeExamples === 'true') {
      for (let category of categories) {
        const examples = await Example.find({ 
          category: category._id, 
          isPublished: true 
        })
        .select('title slug description difficulty')
        .limit(5)
        .sort({ views: -1 });
        
        category = category.toObject();
        category.examples = examples;
      }
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener una categoría por slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findBySlug(req.params.slug);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Obtener ejemplos de esta categoría
    const examples = await Example.find({ 
      category: category._id, 
      isPublished: true 
    })
    .select('title slug description difficulty liferayVersion tags views likes publishedAt')
    .sort({ publishedAt: -1 })
    .limit(20);

    const categoryWithExamples = category.toObject();
    categoryWithExamples.examples = examples;

    res.json({
      success: true,
      data: categoryWithExamples
    });
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Crear nueva categoría
// @route   POST /api/categories
// @access  Private (Admin only)
const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar categoría
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    Object.assign(category, req.body);
    await category.save();

    res.json({
      success: true,
      data: category,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar categoría
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si hay ejemplos en esta categoría
    const exampleCount = await Example.countDocuments({ category: category._id });
    
    if (exampleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${exampleCount} ejemplo(s) asociado(s)`
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas de categorías
// @route   GET /api/categories/stats
// @access  Public
const getCategoriesStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: 'examples',
          localField: '_id',
          foreignField: 'category',
          as: 'examples',
          pipeline: [
            { $match: { isPublished: true } }
          ]
        }
      },
      {
        $addFields: {
          exampleCount: { $size: '$examples' },
          totalViews: { $sum: '$examples.views' },
          totalLikes: { $sum: '$examples.likes' }
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          color: 1,
          icon: 1,
          exampleCount: 1,
          totalViews: 1,
          totalLikes: 1
        }
      },
      {
        $sort: { exampleCount: -1 }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Reordenar categorías
// @route   PUT /api/categories/reorder
// @access  Private (Admin only)
const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de categorías'
      });
    }

    // Actualizar el orden de cada categoría
    const updatePromises = categories.map((cat, index) => 
      Category.findByIdAndUpdate(cat.id, { order: index }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Orden de categorías actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error reordenando categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesStats,
  reorderCategories
};
