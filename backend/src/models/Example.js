const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const exampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  code: {
    type: String,
    required: [true, 'El código FreeMarker es requerido']
  },
  htmlOutput: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    required: [true, 'La explicación es requerida'],
    maxlength: [2000, 'La explicación no puede exceder 2000 caracteres']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  difficulty: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado'],
    default: 'principiante'
  },
  liferayVersion: {
    type: String,
    required: [true, 'La versión de Liferay es requerida'],
    default: '7.4'
  },
  author: {
    name: {
      type: String,
      required: [true, 'El nombre del autor es requerido'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email del autor es requerido'],
      trim: true,
      lowercase: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  usage: {
    context: {
      type: String,
      enum: ['template', 'fragment', 'theme', 'adt', 'web-content'],
      required: [true, 'El contexto de uso es requerido']
    },
    variables: [{
      name: String,
      type: String,
      description: String,
      required: {
        type: Boolean,
        default: false
      }
    }]
  },
  relatedExamples: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Example'
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar performance
exampleSchema.index({ slug: 1 });
exampleSchema.index({ category: 1, isPublished: 1 });
exampleSchema.index({ tags: 1 });
exampleSchema.index({ difficulty: 1 });
exampleSchema.index({ liferayVersion: 1 });
exampleSchema.index({ 'usage.context': 1 });
exampleSchema.index({ isFeatured: -1, views: -1 });
exampleSchema.index({ publishedAt: -1 });

// Índice de texto para búsqueda
exampleSchema.index({
  title: 'text',
  description: 'text',
  explanation: 'text',
  tags: 'text'
});

// Plugin de paginación
exampleSchema.plugin(mongoosePaginate);

// Virtual para URL completa
exampleSchema.virtual('url').get(function() {
  return `/examples/${this.slug}`;
});

// Middleware pre-save para generar slug
exampleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remover caracteres especiales
      .replace(/\s+/g, '-') // reemplazar espacios con guiones
      .replace(/-+/g, '-'); // remover guiones múltiples
      
    // Agregar timestamp si es nuevo documento para evitar duplicados
    if (this.isNew) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
  next();
});

// Middleware post-save para actualizar contador de categoría
exampleSchema.post('save', async function(doc) {
  if (this.isNew && this.isPublished) {
    await mongoose.model('Category').findByIdAndUpdate(
      this.category,
      { $inc: { exampleCount: 1 } }
    );
  }
});

// Middleware pre-remove para actualizar contador de categoría
exampleSchema.pre('remove', async function() {
  await mongoose.model('Category').findByIdAndUpdate(
    this.category,
    { $inc: { exampleCount: -1 } }
  );
});

// Método estático para buscar por slug
exampleSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isPublished: true })
    .populate('category', 'name slug color')
    .populate('relatedExamples', 'title slug description difficulty');
};

// Método para incrementar vistas
exampleSchema.methods.incrementViews = function() {
  this.views = this.views + 1;
  return this.save();
};

// Método para alternar like
exampleSchema.methods.toggleLike = function() {
  this.likes = this.likes + 1;
  return this.save();
};

// Método estático para ejemplos populares
exampleSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .populate('category', 'name slug color');
};

// Método estático para ejemplos destacados
exampleSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ isPublished: true, isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('category', 'name slug color');
};

// Método estático para búsqueda
exampleSchema.statics.search = function(query, options = {}) {
  const {
    category,
    difficulty,
    liferayVersion,
    context,
    limit = 20,
    skip = 0
  } = options;

  let searchQuery = { isPublished: true };

  // Búsqueda de texto
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Filtros adicionales
  if (category) searchQuery.category = category;
  if (difficulty) searchQuery.difficulty = difficulty;
  if (liferayVersion) searchQuery.liferayVersion = liferayVersion;
  if (context) searchQuery['usage.context'] = context;

  return this.find(searchQuery)
    .populate('category', 'name slug color')
    .sort(query ? { score: { $meta: 'textScore' } } : { publishedAt: -1 })
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model('Example', exampleSchema);
