const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('productos.db');

// Base de datos
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT NOT NULL UNIQUE
  )
`);

const conteo = db.prepare('SELECT COUNT(*) AS total FROM productos').get();
if (conteo.total === 0) {
  const insertInicial = db.prepare('INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)');
  insertInicial.run('Teclado Mecánico', 350.00, 'Teclados');
  insertInicial.run('Mouse Gamer', 200.00, 'Ratones');
}

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Función de validación (Prueba Unitaria)
function validarProducto(producto) {
  if (!producto || typeof producto !== 'object') return false;
  if (!producto.nombre || producto.nombre.trim() === '') return false;
  if (typeof producto.precio !== 'number' || producto.precio < 0) return false;
  if (!producto.categoria || producto.categoria.trim() === '') return false;

  return true;
}

// Rutas API
app.get('/api/productos', (req, res) => {
  const productos = db.prepare('SELECT * FROM productos').all();
  res.json(productos);
});

app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body;

  if (!validarProducto({ nombre, precio: Number(precio), categoria })) {
    return res.status(400).json({ error: 'Datos de producto inválidos.' });
  }

  const categoriaExistente = db.prepare(
    'SELECT id FROM productos WHERE LOWER(categoria) = LOWER(?)'
  ).get(categoria.trim());

  if (categoriaExistente) {
    return res.status(400).json({ error: `La categoría "${categoria.trim()}" ya está registrada.` });
  }

  const precioFinal = Number(Number(precio).toFixed(2));
  const stmt = db.prepare('INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)');
  const info = stmt.run(nombre.trim(), precioFinal, categoria.trim());

  res.status(201).json({
    id: info.lastInsertRowid,
    nombre: nombre.trim(),
    precio: precioFinal,
    categoria: categoria.trim()
  });
});

module.exports = { app, validarProducto };