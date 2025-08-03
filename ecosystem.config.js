module.exports = {
  apps: [
    {
      name: 'freemarker-backend',
      script: 'src/app.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Configuración de logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Reinicio automático
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      
      // Configuración de memoria
      max_memory_restart: '500M',
      
      // Reintentos
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
