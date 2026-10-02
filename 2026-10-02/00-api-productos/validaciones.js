import { body, param, query, validationResult } from "express-validator";

export const validarFiltros = [
  query("nombre").isAlpha("es-ES").optional(),
  query("cantidadMin").isInt({ min: 1 }).optional(),
  query("cantidadMax").isInt({ min: 1 }).optional(),
];

export const validarId = param("id").isInt({ min: 1 });

export const validarProducto = [
  body("nombre")
    .isAlpha("es-ES")
    .withMessage("Solo letras")
    .isLength({ min: 1, max: 45 })
    .withMessage("Solo entre 1 y 45 caracteres"),
  body("cantidad").isInt({ min: 0 }).withMessage("Solo numeros positivos"),
];

// Middleware para verificar validaciones
export const verificarValidaciones = (req, res, next) => {
  const resultadoValidacion = validationResult(req);
  if (!resultadoValidacion.isEmpty()) {
    return res.status(400).send({
      mensaje: "Parámetros no válidos",
      errores: resultadoValidacion.array(),
    });
  }
  next();
};
