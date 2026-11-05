import type { Request, Response } from "express";
import {
  getAllCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer as updateCustomerInDb,
} from "../models/customer.model.js";

export async function getCustomers(req: Request, res: Response) {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Lista todos los clientes' */
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("[GET /api/customers]", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
}

export async function getCustomer(req: Request, res: Response) {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Obtiene un cliente por su id' */
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  try {
    const customer = await getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(customer);
  } catch (error) {
    console.error("[GET /api/customers/:id]", error);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
}

export async function createCustomer(req: Request, res: Response) {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Crea un nuevo cliente'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'María López', email: 'maria@gmail.com', phone: '8441234567' }
     } */
  const { name, email, phone } = req.body;

  try {
    const customer = await insertCustomer(name, email, phone);
    res.status(201).json(customer);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }
    console.error("[POST /api/customers]", error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  /* #swagger.tags = ['Customers']
     #swagger.summary = 'Actualiza un cliente existente'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'María López', email: 'maria.lopez@gmail.com', phone: '8449876543' }
     } */
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const { name, email, phone } = req.body;

  try {
    const customer = await updateCustomerInDb(id, name, email, phone);
    if (!customer) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(customer);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }
    console.error("[PUT /api/customers/:id]", error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
}
