import express from "express";
import mysql from "mysql2/promise";

let db = null;

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });
  console.log("Conectado a la base de datos");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

// GET para entregar listado de productos
app.get("/productos", async (req, res) => {
  const [productos] = await db.execute("SELECT * FROM productos");

  res.send(productos);
});

// GET para entregar detalle de producto
app.get("/productos/:id", async (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id (solo si es un numero positivo)

  const [productos] = await db.execute("SELECT * FROM productos WHERE id=?", [
    id,
  ]);

  if (productos.length === 0) {
    return res.status(404).send("Producto no encontrado");
  }

  res.send(productos[0]);
});

// POST para crear producto
app.post("/productos", (req, res) => {
  // Extraigo del body los atributos del nuevo producto
  const { producto, cantidad } = req.body;

  // Validar los atributos de body
  // Envio respuesta
  //res.status(201).send(nuevoProducto);
});

// PUT para modificar producto a partir de un id
app.put("/productos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id

  // Verificar que este presente el producto

  // Validar el body
  const { producto, cantidad } = req.body;
  // Verificar que existan los campos obligatorios

  // Responder con producto modificado
  //res.send(productoEncontrado);
});

// DELETE para quitar un producto a partir de un id
app.delete("/productos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id

  // Verificar que este presente el producto

  // Quitar del arreglo

  // Retornar producto quitado
  //res.send(productoEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
