import { useState, useEffect } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: '' });
  const [error, setError] = useState(''); // Estado para mostrar los errores en pantalla

  // Cargar productos al iniciar
  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al cargar productos:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      const res = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      // Si el backend devuelve un status de error (400)
      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al guardar el producto');
        return;
      }

      // Si todo sale bien, agregamos el producto a la lista y limpiamos el formulario
      setProductos([...productos, data]);
      setForm({ nombre: '', precio: '', categoria: '' });
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Catálogo de Productos</h1>

      {/* Alerta visible si ocurre un error de validación */}
      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={form.nombre}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          step="0.01" /* Limita la entrada visual a 2 decimales */
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría (debe ser única)"
          value={form.categoria}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Agregar Producto</button>
      </form>

      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((prod) => (
          <li key={prod.id}>
            <strong>{prod.nombre}</strong> - Q{Number(prod.precio).toFixed(2)} <em>({prod.categoria})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;