const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// Datos en memoria (Arreglo temporal)
let productos = [
  { id: 1, nombre: 'Teclado Mecánico', precio: 350, categoria: 'Periféricos' },
  { id: 2, nombre: 'Mouse Gamer', precio: 200, categoria: 'Periféricos' }
];

// 1. Ruta GET /api/productos (Obtener todos los productos)
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// 2. Ruta POST /api/productos (Agregar un producto)
app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body;

  // Manejo de errores / Validación de campos
  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Todos los campos (nombre, precio, categoría) son obligatorios.' });
  }

  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    precio: Number(precio),
    categoria
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});