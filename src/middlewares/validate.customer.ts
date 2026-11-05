import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const customerSchema = z.object({
  name: z
    .string({ error: "el nombre es obligatorio" })
    .trim()
    .min(1, "el nombre no puede estar vacío")
    .max(100, "el nombre no puede superar los 100 caracteres"),
  email: z
    .string({ error: "el correo es obligatorio" })
    .trim()
    .toLowerCase()
    .email("el formato del correo no es válido")
    .max(100, "el correo no puede superar los 100 caracteres"),
  phone: z
    .string({ error: "el teléfono es obligatorio" })
    .trim()
    .min(1, "el teléfono no puede estar vacío")
    .max(50, "el teléfono no puede superar los 50 caracteres"),
});

export function validateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = customerSchema.safeParse(req.body);

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
