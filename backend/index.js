const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = 5000;

// Inicializar la base de datos SQLite (se crea el archivo productos.db automáticamente)
const db = new Database('productos.db');

// Crear la tabla "productos" si aún no existe e insertar datos iniciales
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT NOT NULL
  )
`);

// Insertar datos de prueba si la tabla está vacía
const conteo = db.prepare('SELECT COUNT(*) AS total FROM productos').get();
if (conteo.total === 0) {
  const insertInicial = db.prepare('INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)');
  insertInicial.run('Teclado Mecánico', 350, 'Periféricos');
  insertInicial.run('Mouse Gamer', 200, 'Periféricos');
}

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// 1. Ruta GET /api/productos (Obtener todos los productos de SQLite)
app.get('/api/productos', (req, res) => {
  const productos = db.prepare('SELECT * FROM productos').all();
  res.json(productos);
});

// 2. Ruta POST /api/productos (Agregar un producto a SQLite)
app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body;

  // Validación de campos
  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Todos los campos (nombre, precio, categoría) son obligatorios.' });
  }

  // Insertar en la base de datos
  const stmt = db.prepare('INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)');
  const info = stmt.run(nombre, Number(precio), categoria);

  const nuevoProducto = {
    id: info.lastInsertRowid,
    nombre,
    precio: Number(precio),
    categoria
  };

  res.status(201).json(nuevoProducto);
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});