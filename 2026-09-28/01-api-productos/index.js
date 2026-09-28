import express from "express";
import mysql from "mysql2/promise";
import { body, param, query, validationResult } from "express-validator";

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
app.get(
  "/productos",
  [
    query("nombre").isAlpha("es-ES").optional(),
    query("cantidadMin").isInt({ min: 1 }).optional(),
    query("cantidadMax").isInt({ min: 1 }).optional(),
  ],
  async (req, res) => {
    const resultadoValidacion = validationResult(req);
    if (!resultadoValidacion.isEmpty()) {
      return res.status(400).send({
        mensaje: "Parámetros no válidos",
        errores: resultadoValidacion.array(),
      });
    }
    const filtros = [];
    const parametros = [];

    const { nombre, cantidadMin, cantidadMax } = req.query;

    if (nombre) {
      // nombre LIKE %a%
      filtros.push("nombre LIKE ?");
      parametros.push(`%${nombre}%`);
    }

    if (cantidadMin !== undefined) {
      filtros.push("cantidad >= ?");
      parametros.push(Number(cantidadMin));
    }

    if (cantidadMax !== undefined) {
      filtros.push("cantidad <= ?");
      parametros.push(Number(cantidadMax));
    }

    let sql = "SELECT * FROM productos";

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }

    // TODO: Agregar consulta de paginacion (offset, limit)
    // TODO: Agregar consulta para ordenar (ascendente o descente) por campo (nombre y/o cantidad)

    console.log(sql);
    const [productos] = await db.execute(sql, parametros);

    res.send(productos);
  },
);

// GET para entregar detalle de producto
app.get("/productos/:id", param("id").isInt({ min: 1 }), async (req, res) => {
  const resultadoValidacion = validationResult(req);
  if (!resultadoValidacion.isEmpty()) {
    return res.status(400).send({
      mensaje: "Parámetros no válidos",
      errores: resultadoValidacion.array(),
    });
  }

  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);

  const [productos] = await db.execute("SELECT * FROM productos WHERE id=?", [
    id,
  ]);

  if (productos.length === 0) {
    return res.status(404).send("Producto no encontrado");
  }

  res.send(productos[0]);
});

// POST para crear producto
app.post(
  "/productos",
  [
    body("nombre")
      .isAlpha("es-ES")
      .withMessage("Solo letras")
      .isLength({ min: 1, max: 45 })
      .withMessage("Solo entre 1 y 45 caracteres"),
    body("cantidad").isInt({ min: 0 }).withMessage("Solo numeros positivos"),
  ],
  async (req, res) => {
    const resultadoValidacion = validationResult(req);
    if (!resultadoValidacion.isEmpty()) {
      return res.status(400).send({
        mensaje: "Parámetros no válidos",
        errores: resultadoValidacion.array(),
      });
    }

    // Extraigo del body los atributos del nuevo producto
    const { nombre, cantidad } = req.body;

    const [result] = await db.execute(
      "INSERT INTO productos(nombre,cantidad) VALUES (?,?)",
      [nombre, cantidad],
    );

    // Envio respuesta
    res.status(201).send({ id: result.insertId, nombre, cantidad });
  },
);

// PUT para modificar producto a partir de un id
app.put(
  "/productos/:id",
  [
    param("id").isInt({ min: 1 }),
    body("nombre")
      .isAlpha("es-ES")
      .withMessage("Solo letras")
      .isLength({ min: 1, max: 45 })
      .withMessage("Solo entre 1 y 45 caracteres"),
    body("cantidad").isInt({ min: 0 }).withMessage("Solo numeros positivos"),
  ],
  (req, res) => {
    // Extraigo el id de los parametros de la ruta
    const id = Number(req.params.id);

    // Verificar que este presente el producto

    const { nombre, cantidad } = req.body;
    // Verificar que existan los campos obligatorios

    // TODO: Agregar consulta a la base de datos para modificar producto

    // Responder con producto modificado
    //res.send(productoEncontrado);
  },
);

// DELETE para quitar un producto a partir de un id
app.delete("/productos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);
  // Validar id

  // Verificar que este presente el producto

  // TODO: Agregar consulta a la base de datos para quitar producto

  // Retornar producto quitado
  //res.send(productoEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
