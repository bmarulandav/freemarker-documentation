# Dockerfile para el Frontend
FROM nginx:alpine

# Copiar archivos del frontend
COPY public/ /usr/share/nginx/html/

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se ejecuta automáticamente
