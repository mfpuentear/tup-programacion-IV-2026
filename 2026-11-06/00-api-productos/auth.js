import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, payload);
    }),
  );
}

router.post(
  "/login",
  [
    body("username").isAlphanumeric("es-ES").isLength({ max: 50 }),
    body("password").isAlphanumeric("es-ES").isLength({ max: 50 }),
  ],
  verificarValidaciones,
  async (req, res) => {
    const { username, password } = req.body;

    // Consultar por el usuario a la base de datos
    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE username=?",
      [username],
    );

    if (usuarios.length === 0) {
      return res.status(400).json("Usuario inválido");
    }

    // Verificar la contraseña
    const hashedPassword = usuarios[0].password;

    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res.status(400).json("Contraseña inválida");
    }

    // Generar jwt
    const payload = {
      userId: usuarios[0].id,
      esAdmin: Boolean(usuarios[0].es_admin),
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    // Devolver token, nombre de usuario y si es administrador
    res.json({
      token,
      username: usuarios[0].username,
      esAdmin: Boolean(usuarios[0].es_admin),
    });
  },
);

export default router;
