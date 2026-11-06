import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarId,
  verificarValidaciones,
} from "./validaciones.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", validarAutenticacion, async (req, res) => {
  // Verificar que el usuario sea administrador
  if (!req.user.esAdmin) {
    return res.status(401).send("Usuario no autorizado");
  }

  const [usuarios] = await db.execute(
    "SELECT id, username, nombres, apellidos, es_admin FROM usuarios",
  );

  res.json(usuarios);
});

router.get(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    // Verificar que el usuario sea administrador
    if (!req.user.esAdmin) {
      return res.status(401).send("Usuario no autorizado");
    }

    const id = Number(req.params.id);
    const [usuarios] = await db.execute(
      "SELECT id, username, nombres, apellidos, es_admin FROM usuarios WHERE id=?",
      [id],
    );

    if (usuarios.length === 0) {
      return res.status(404).json("Usuario no encontrado");
    }

    res.json(usuarios[0]);
  },
);

router.post(
  "/",
  [
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
  ],
  verificarValidaciones,
  async (req, res) => {
    // Verificar que el usuario sea administrador
    if (!req.user.esAdmin) {
      return res.status(401).send("Usuario no autorizado");
    }

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

// TODO: Agregar metodo put
// TODO: Agregar metodo delete

export default router;
