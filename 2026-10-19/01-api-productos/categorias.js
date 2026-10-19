import express from "express";
import { db } from "./db.js";
import {
  validarId,
  validarCategoria,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [categorias] = await db.execute("SELECT * FROM categorias");
  res.send(categorias);
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  // Obtengo id
  const id = Number(req.params.id);

  const [categorias] = await db.execute("SELECT * FROM categorias WHERE id=?", [
    id,
  ]);

  if (categorias.length === 0) {
    return res.status(404).send("Categoria no encontrada");
  }

  res.send(categorias[0]);
});

router.post("/", validarCategoria, verificarValidaciones, async (req, res) => {
  // Obtengo body
  const { nombre } = req.body;

  const [result] = await db.execute(
    "INSERT INTO categorias (nombre) VALUES (?)",
    [nombre],
  );

  res.status(201).send({ id: result.insertId, nombre });
});

// TODO: Agregar metodo put
// TODO: Agregar metodo delete

router.get(
  "/:id/productos",
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    let sql =
      "SELECT p.id, p.nombre, p.cantidad, c.nombre AS categoria " +
      "FROM productos p " +
      "JOIN categorias c ON p.categoria_id = c.id " +
      "WHERE c.id = ? ";

    const [productos] = await db.execute(sql, [id]);

    res.send(productos);
  },
);

export default router;
