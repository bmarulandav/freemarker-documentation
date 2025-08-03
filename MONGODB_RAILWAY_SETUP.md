# Instrucciones para configurar MongoDB Atlas para Railway

## 1. Configurar Network Access
- Ve a MongoDB Atlas → Network Access
- Click "Add IP Address"  
- Selecciona "Allow access from anywhere" (0.0.0.0/0)
- Esto permite conexiones desde Railway

## 2. Verificar Database User
- Ve a Database Access
- Asegúrate que el usuario tenga permisos de Read/Write
- Usuario: freemarker o brayanbamv

## 3. Connection String para Railway
Usar uno de estos:

### Opción A (actual):
```
mongodb+srv://brayanbamv:JT2CPdKfCYDFm4u@cluster0.wdy0rxy.mongodb.net/FreemarkerDocs
```

### Opción B (alternativa):
```
mongodb+srv://freemarker:gfIg1FrFYk3vxUgm@cluster0.vqdaj.mongodb.net/FreemarkerDocs
```

## 4. Configurar en Railway
Variables → Add Variable:
- MONGODB_URI = [uno de los connection strings de arriba]

## 5. Verificar logs
Railway → Deployments → Ver logs para errores de conexión
