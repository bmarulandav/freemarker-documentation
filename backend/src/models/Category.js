const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
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
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  icon: {
    type: String,
    default: 'folder'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  exampleCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, order: 1 });

// Virtual para obtener ejemplos de esta categoría
categorySchema.virtual('examples', {
  ref: 'Example',
  localField: '_id',
  foreignField: 'category'
});

// Middleware pre-save para generar slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remover caracteres especiales
      .replace(/\s+/g, '-') // reemplazar espacios con guiones
      .replace(/-+/g, '-'); // remover guiones múltiples
  }
  next();
});

// Método estático para buscar por slug
categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Método para incrementar contador de ejemplos
categorySchema.methods.incrementExampleCount = function() {
  this.exampleCount = this.exampleCount + 1;
  return this.save();
};

// Método para decrementar contador de ejemplos
categorySchema.methods.decrementExampleCount = function() {
  this.exampleCount = Math.max(0, this.exampleCount - 1);
  return this.save();
};

module.exports = mongoose.model('Category', categorySchema);
