<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# FreeMarker Documentation Platform - Copilot Instructions

Este es un proyecto full-stack para documentar ejemplos de FreeMarker en Liferay, con backend en Node.js/Express/MongoDB y frontend en React.

## Contexto del Proyecto

**Objetivo**: Crear una plataforma moderna para documentar y mostrar ejemplos funcionales de FreeMarker en Liferay, organizados por categorías como Variables útiles, Fragmentos, Web Content Templates, ADTs, Temas, etc.

## Stack Tecnológico

### Backend (Actual)
- Node.js + Express.js
- MongoDB con Mongoose
- JWT para autenticación
- Middleware de seguridad (helmet, cors, rate-limiting)
- Paginación con mongoose-paginate-v2

### Frontend (Próximo)
- React con Vite
- Tailwind CSS para estilos
- React Router para navegación
- React Query para manejo de estado
- React Syntax Highlighter para código

## Estructura de Datos Clave

### Example Model
- Contiene código FreeMarker, explicación, categoría, tags, dificultad
- Sistema de likes y vistas
- Información del autor
- Variables de contexto (usage.variables)

### Category Model
- 9 categorías predefinidas de FreeMarker en Liferay
- Sistema de ordenamiento y contadores automáticos

### User Model
- Roles: user, moderator, admin
- Preferencias de tema y notificaciones

## Patrones de Código

### Controllers
- Siempre incluir manejo de errores try-catch
- Usar códigos de estado HTTP apropiados
- Incluir validación de entrada
- Responses consistentes con { success, data, message }

### Routes
- Usar middleware de autenticación según sea necesario
- Implementar rate limiting para APIs públicas
- Validar parámetros de entrada

### Models
- Incluir validaciones de Mongoose
- Usar índices para performance
- Implementar métodos estáticos para queries comunes
- Pre/post middleware para lógica automática

## Ejemplos de FreeMarker

Cuando generes ejemplos de código FreeMarker, enfócate en:
- **Variables útiles**: theme_display, user, group, layout
- **Sintaxis clara**: bucles, condicionales, métodos
- **Contexto Liferay**: servicios, APIs, objetos disponibles
- **Buenas prácticas**: validaciones, manejo de errores
- **Casos reales**: fragmentos, templates, ADTs, temas

## Convenciones de Naming

- Rutas: kebab-case (/api/examples/featured)
- Variables JS: camelCase (themeDisplay)
- Archivos: camelCase para JS, kebab-case para otros
- Slugs: kebab-case generados automáticamente

## Seguridad

- Siempre validar entrada del usuario
- Usar middleware de autenticación apropiado
- Implementar rate limiting
- Sanitizar datos antes de guardar
- No exponer información sensible en responses

## Testing y Desarrollo

- Usar datos de ejemplo realistas de Liferay
- Incluir casos edge en validaciones
- Comentar código complejo, especialmente lógica de FreeMarker
- Preferir código legible sobre optimización prematura
