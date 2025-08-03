const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freemarker-docs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    
    // Evento de conexión exitosa
    mongoose.connection.on('connected', () => {
      console.log('📊 Mongoose conectado a MongoDB');
    });

    // Evento de error
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    // Evento de desconexión
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose desconectado de MongoDB');
    });

    // Cerrar conexión cuando la aplicación se cierre
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔚 Conexión MongoDB cerrada debido a terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
