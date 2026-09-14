import express from "express";

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

let productos = [
  { id: 1, producto: "Pan", cantidad: 5, precio: 2 },
  { id: 2, producto: "Detergente", cantidad: 20, precio: 10 },
  { id: 4, producto: "Galletas", cantidad: 0, precio: 5 },
  { id: 5, producto: "Yogurt", cantidad: 50, precio: 15 },
  { id: 3, producto: "Jabon", cantidad: 30, precio: 6 },
  { id: 6, producto: "Leche", cantidad: 100, precio: 20 },
];

let nextId = 7;

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

// GET para entregar listado de productos
app.get("/productos", (req, res) => {
  // Copio arreglo original
  let productosFiltrados = [...productos];

  let precioMin = req.query.precioMin;
  if (precioMin) {
    precioMin = Number(precioMin);
    if (isNaN(precioMin) || precioMin < 0) {
      return res.status(400).send("Precio mínimo inválido");
    }
    productosFiltrados = productosFiltrados.filter(
      (p) => p.precio >= precioMin,
    );
  }

  const productoNombre = req.query.productoNombre;
  if (productoNombre) {
    productosFiltrados = productosFiltrados.filter((p) =>
      p.producto
        .toLocaleLowerCase()
        .includes(productoNombre.toLocaleLowerCase()),
    );
  }

  res.send(productosFiltrados);
});

// GET para entregar detalle de producto
app.get("/productos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id (solo si es un numero positivo)

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).send("Producto no encontrado");
  }

  res.send(producto);
});

// POST para crear producto
app.post("/productos", (req, res) => {
  // Extraigo del body los atributos del nuevo producto
  const { producto, cantidad, precio } = req.body;

  // Validar los atributos de body

  // Creo un nuevo producto
  const nuevoProducto = {
    id: nextId++,
    producto: producto.trim(),
    precio,
    cantidad,
  };

  // Agrego el producto al arreglo
  productos.push(nuevoProducto);

  // Envio respuesta
  res.status(201).send(nuevoProducto);
});

// PUT para modificar producto a partir de un id
app.put("/productos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id

  // Verificar que este presente el producto
  let productoEncontrado = productos.find((p) => p.id === id);

  if (!productoEncontrado) {
    return res.status(404).send("Producto no encontrado");
  }

  // Validar el body
  const { producto, cantidad, precio } = req.body;
  // Verificar que existan los campos obligatorios

  // Modificar el producto
  productoEncontrado.producto = producto;
  productoEncontrado.cantidad = cantidad;
  productoEncontrado.precio = precio;

  // Responder con producto modificado
  res.send(productoEncontrado);
});

// DELETE para quitar un producto a partir de un id
app.delete("/productos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id

  // Verificar que este presente el producto
  let productoEncontrado = productos.find((p) => p.id === id);

  if (!productoEncontrado) {
    return res.status(404).send("Producto no encontrado");
  }

  // Quitar del arreglo
  productos = productos.filter((p) => p.id !== id);

  // Retornar producto quitado
  res.send(productoEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
