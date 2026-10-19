const request = require('supertest');
const { app, validarProducto } = require('./app');

// ==========================================
// 1. PRUEBAS UNITARIAS: validarProducto()
// ==========================================
describe('Pruebas Unitarias - validarProducto()', () => {
  test('Caso válido: retorna true con datos correctos', () => {
    const producto = { nombre: 'Monitor OLED', precio: 1200.00, categoria: 'Monitores' };
    expect(validarProducto(producto)).toBe(true);
  });

  test('Caso error (precio negativo): retorna false', () => {
    const producto = { nombre: 'Audífonos', precio: -50, categoria: 'Audio' };
    expect(validarProducto(producto)).toBe(false);
  });

  test('Caso error (categoría vacía): retorna false', () => {
    const producto = { nombre: 'Silla Gamer', precio: 150, categoria: '' };
    expect(validarProducto(producto)).toBe(false);
  });
});

// ==========================================
// 2. PRUEBAS DE INTEGRACIÓN: API Endpoints
// ==========================================
describe('Pruebas de Integración - GET y POST /api/productos', () => {

  test('GET /api/productos - Debe retornar status 200 y una lista de productos', async () => {
    const res = await request(app).get('/api/productos');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Verificación de estructura
    expect(res.body[0]).toHaveProperty('nombre');
    expect(res.body[0]).toHaveProperty('precio');
  });

  test('POST /api/productos - Debe retornar 400 al enviar un precio negativo (caso de error)', async () => {
    const productoInvalido = {
      nombre: 'Micrófono USB',
      precio: -100,
      categoria: 'Micrófonos'
    };

    const res = await request(app)
      .post('/api/productos')
      .send(productoInvalido);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});