const Example = require('../models/Example');
const Category = require('../models/Category');

// @desc    Obtener todos los ejemplos con paginación y filtros
// @route   GET /api/examples
// @access  Public
const getExamples = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      difficulty,
      liferayVersion,
      context,
      search,
      featured,
      popular,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'category', select: 'name slug color icon' },
        { path: 'relatedExamples', select: 'title slug description difficulty', limit: 3 }
      ]
    };

    let query = { isPublished: true };

    // Filtros
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) query.category = categoryDoc._id;
    }
    if (difficulty) query.difficulty = difficulty;
    if (liferayVersion) query.liferayVersion = liferayVersion;
    if (context) query['usage.context'] = context;
    if (featured === 'true') query.isFeatured = true;

    // Búsqueda de texto
    if (search) {
      query.$text = { $search: search };
      options.sort = { score: { $meta: 'textScore' } };
    }

    // Ejemplos populares
    if (popular === 'true') {
      options.sort = { views: -1, likes: -1 };
    }

    const examples = await Example.paginate(query, options);

    res.json({
      success: true,
      data: examples.docs,
      pagination: {
        currentPage: examples.page,
        totalPages: examples.totalPages,
        totalDocs: examples.totalDocs,
        hasNextPage: examples.hasNextPage,
        hasPrevPage: examples.hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error obteniendo ejemplos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener un ejemplo por slug
// @route   GET /api/examples/:slug
// @access  Public
const getExampleBySlug = async (req, res) => {
  try {
    const example = await Example.findBySlug(req.params.slug);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }

    // Incrementar vistas
    await example.incrementViews();

    res.json({
      success: true,
      data: example
    });
  } catch (error) {
    console.error('Error obteniendo ejemplo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Crear nuevo ejemplo
// @route   POST /api/examples
// @access  Private (Auth required)
const createExample = async (req, res) => {
  try {
    const exampleData = {
      ...req.body,
      author: {
        name: req.user.fullName,
        email: req.user.email,
        avatar: req.user.displayAvatar
      }
    };

    const example = new Example(exampleData);
    await example.save();

    await example.populate('category', 'name slug color icon');

    res.status(201).json({
      success: true,
      data: example,
      message: 'Ejemplo creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando ejemplo:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar ejemplo
// @route   PUT /api/examples/:id
// @access  Private (Auth required + ownership or admin)
const updateExample = async (req, res) => {
  try {
    const example = await Example.findById(req.params.id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }

    // Verificar permisos (autor o admin)
    if (example.author.email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este ejemplo'
      });
    }

    Object.assign(example, req.body);
    await example.save();

    await example.populate('category', 'name slug color icon');

    res.json({
      success: true,
      data: example,
      message: 'Ejemplo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando ejemplo:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar ejemplo
// @route   DELETE /api/examples/:id
// @access  Private (Auth required + ownership or admin)
const deleteExample = async (req, res) => {
  try {
    const example = await Example.findById(req.params.id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }

    // Verificar permisos (autor o admin)
    if (example.author.email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este ejemplo'
      });
    }

    await example.remove();

    res.json({
      success: true,
      message: 'Ejemplo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando ejemplo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Dar like a un ejemplo
// @route   POST /api/examples/:id/like
// @access  Public
const likeExample = async (req, res) => {
  try {
    const example = await Example.findById(req.params.id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Ejemplo no encontrado'
      });
    }

    await example.toggleLike();

    res.json({
      success: true,
      data: { likes: example.likes },
      message: 'Like registrado exitosamente'
    });
  } catch (error) {
    console.error('Error dando like:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener ejemplos populares
// @route   GET /api/examples/popular
// @access  Public
const getPopularExamples = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const examples = await Example.getPopular(limit);

    res.json({
      success: true,
      data: examples
    });
  } catch (error) {
    console.error('Error obteniendo ejemplos populares:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Obtener ejemplos destacados
// @route   GET /api/examples/featured
// @access  Public
const getFeaturedExamples = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const examples = await Example.getFeatured(limit);

    res.json({
      success: true,
      data: examples
    });
  } catch (error) {
    console.error('Error obteniendo ejemplos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// @desc    Buscar ejemplos
// @route   GET /api/examples/search
// @access  Public
const searchExamples = async (req, res) => {
  try {
    const { q, category, difficulty, liferayVersion, context, limit = 20, skip = 0 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query de búsqueda requerido'
      });
    }

    const options = {
      category,
      difficulty,
      liferayVersion,
      context,
      limit: parseInt(limit),
      skip: parseInt(skip)
    };

    const examples = await Example.search(q.trim(), options);

    res.json({
      success: true,
      data: examples,
      total: examples.length
    });
  } catch (error) {
    console.error('Error buscando ejemplos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getExamples,
  getExampleBySlug,
  createExample,
  updateExample,
  deleteExample,
  likeExample,
  getPopularExamples,
  getFeaturedExamples,
  searchExamples
};
