import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const productSchema = z.object({
  name: z
    .string({ error: "el nombre es obligatorio" })
    .trim()
    .min(1, "el nombre no puede estar vacío"),
  description: z
    .string({ error: "la descripción es obligatoria" })
    .trim()
    .min(1, "la descripción no puede estar vacía"),
  price: z
    .number({ error: "el precio debe ser un número" })
    .positive("el precio debe ser mayor a 0"),
});

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Datos inválidos",
      errores: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  req.body = result.data;
  next();
}
