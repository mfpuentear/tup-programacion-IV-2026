import express from "express";
import { conectarDB } from "./db.js";
import productosRouter from "./productos.js";
import categoriasRouter from "./categorias.js";
import usuariosRouter from "./usuarios.js";

conectarDB();

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});

app.use("/productos", productosRouter);
app.use("/categorias", categoriasRouter);
app.use("/usuarios", usuariosRouter);

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
