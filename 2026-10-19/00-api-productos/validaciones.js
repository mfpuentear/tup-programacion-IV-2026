import { body, param, query, validationResult } from "express-validator";

// Validacion de filtros de productos
export const validarFiltrosProductos = [
  query("nombre").isAlpha("es-ES").optional(),
  query("cantidadMin").isInt({ min: 1 }).optional(),
  query("cantidadMax").isInt({ min: 1 }).optional(),
];

export const validarId = param("id").isInt({ min: 1 });

// Validacion de producto
export const validarProducto = [
  body("nombre")
    .isAlpha("es-ES")
    .withMessage("Solo letras")
    .isLength({ min: 1, max: 45 })
    .withMessage("Solo entre 1 y 45 caracteres"),
  body("categoriaId")
    .isInt({ min: 1 })
    .withMessage("categoriaId debe ser un numero positivo mayor a 0"),
  body("cantidad")
    .isInt({ min: 0 })
    .withMessage("Solo numeros positivos o cero"),
];

// Validacion de categoria
export const validarCategoria = [
  body("nombre").isAlpha("es-ES", { ignore: " " }).isLength({ max: 50 }),
];

// Middleware para verificar validaciones
export const verificarValidaciones = (req, res, next) => {
  const resultadoValidacion = validationResult(req);
  if (!resultadoValidacion.isEmpty()) {
    return res.status(400).json({
      mensaje: "Parámetros no válidos",
      errores: resultadoValidacion.array(),
    });
  }
  next();
};
