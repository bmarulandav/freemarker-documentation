const mongoose = require('mongoose');
require('dotenv').config();

async function checkExamples() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Example = require('./src/models/Example');
    const count = await Example.countDocuments();
    console.log('📊 Total de ejemplos en la base de datos:', count);
    
    const examples = await Example.find().select('title category difficulty');
    console.log('📝 Lista de ejemplos:');
    examples.forEach((ex, i) => {
      console.log(`${i + 1}. ${ex.title} - Dificultad: ${ex.difficulty}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkExamples();
