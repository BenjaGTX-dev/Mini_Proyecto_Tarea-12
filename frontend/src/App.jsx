import { useState, useEffect } from 'react'

function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  // 1. Consumir API (GET /api/productos)
  const obtenerProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('http://localhost:5000/api/productos')
      if (!res.ok) throw new Error('Error al conectar con la API')
      const data = await res.json()
      setProductos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerProductos()
  }, [])

  // 2. Enviar datos a la API (POST /api/productos)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMensajeExito('')

    if (!nombre || !precio || !categoria) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio, categoria })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el producto')
      }

      setMensajeExito('¡Producto agregado correctamente!')
      setNombre('')
      setPrecio('')
      setCategoria('')
      obtenerProductos() // Actualizar la lista
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Catálogo de Productos</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <h3>Agregar Producto</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {/* Mensajes de Estado */}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      {loading && <p>Cargando productos desde la API...</p>}

      {/* Lista de Productos */}
      {!loading && !error && (
        <ul>
          {productos.map((p) => (
            <li key={p.id}>
              <strong>{p.nombre}</strong> - ${p.precio} ({p.categoria})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App