import type { Request, Response } from "express";
import { getAllSales, getSaleById, insertSale } from "../models/sale.model.js";

export async function getSales(req: Request, res: Response) {
  /* #swagger.tags = ['Sales']
     #swagger.summary = 'Lista todas las ventas con el nombre del cliente' */
  try {
    const sales = await getAllSales();
    res.json(sales);
  } catch (error) {
    console.error("[GET /api/sales]", error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
}

export async function getSale(req: Request, res: Response) {
  /* #swagger.tags = ['Sales']
     #swagger.summary = 'Obtiene una venta por su id' */
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  try {
    const sale = await getSaleById(id);
    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json(sale);
  } catch (error) {
    console.error("[GET /api/sales/:id]", error);
    res.status(500).json({ error: "Error al obtener la venta" });
  }
}

export async function createSale(req: Request, res: Response) {
  /* #swagger.tags = ['Sales']
     #swagger.summary = 'Crea una nueva venta'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { customer_id: 1 }
     } */
  const customerId = Number(req.body.customer_id);
  if (!Number.isInteger(customerId) || customerId < 1) {
    return res
      .status(400)
      .json({ error: "customer_id debe ser un número entero mayor a 0" });
  }

  try {
    const sale = await insertSale(customerId);
    res.status(201).json(sale);
  } catch (error: any) {
    if (error.code === "23503") {
      return res.status(404).json({ error: "El cliente no existe" });
    }
    console.error("[POST /api/sales]", error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
}
