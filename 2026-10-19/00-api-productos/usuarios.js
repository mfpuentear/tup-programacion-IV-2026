import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req, res) => {
  const [usuarios] = await db.execute("SELECT * FROM usuarios");
  // RECORDAR Quitar la contraseña en la api
  res.json(usuarios.map((u) => ({ ...u, password: undefined })));
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [usuarios] = await db.execute(
    "SELECT id, username, nombres, apellidos, es_admin FROM usuarios WHERE id=?",
    [id],
  );

  if (usuarios.length === 0) {
    return res.status(404).json("Usuario no encontrado");
  }

  res.json(usuarios[0]);
});

router.post(
  "/",
  body("username").isAlphanumeric("es-ES").isLength({ max: 50 }),
  body("apellidos").isAlpha("es-ES").isLength({ max: 50 }),
  body("nombres").isAlpha("es-ES").isLength({ max: 50 }),
  body("password").isStrongPassword({
    minLength: 8, // Minimo de 8 caracteres
    minLowercase: 1, // Al menos una letra en minusculas
    minUppercase: 0, // Letras mayusculas opcionales
    minNumbers: 1, // Al menos un número
    minSymbols: 0, // Símbolos opcionales
  }),
  body("esAdmin").isBoolean(),
  verificarValidaciones,
  async (req, res) => {
    const { username, apellidos, nombres, password, esAdmin } = req.body;

    // Creamos Hash de la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO usuarios (username, apellidos, nombres, password, es_admin) VALUES (?,?,?,?,?)",
      [username, apellidos, nombres, hashedPassword, esAdmin],
    );

    res
      .status(201)
      .json({ id: result.insertId, username, apellidos, nombres, esAdmin });
  },
);

router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

export default router;
