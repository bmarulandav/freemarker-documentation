import './App.css'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#212529', 
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '3rem'
        }}>
          🚀 FreeMarker Docs
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>
            ✅ ¡Frontend funcionando perfectamente!
          </h2>
          <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
            Documentación completa y ejemplos de FreeMarker para Liferay DXP.
            Aprende con más de 50 ejemplos prácticos y guías paso a paso.
          </p>
        </div>

        <div style={{
          backgroundColor: '#e9ecef',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#495057' }}>
            Backend API: <strong>http://localhost:5000/api</strong><br/>
            Frontend: <strong>http://localhost:5173</strong>
          </p>
        </div>

        <div style={{
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3 style={{ color: '#0c5460', marginBottom: '1rem' }}>
            🎯 Proyecto creado exitosamente
          </h3>
          <ul style={{ color: '#0c5460', paddingLeft: '1.5rem' }}>
            <li>✅ React 18 + Vite funcionando</li>
            <li>✅ Estructura de proyecto limpia</li>
            <li>✅ Sin conflictos de dependencias</li>
            <li>✅ Listo para desarrollo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
