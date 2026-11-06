import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct as updateProductInDb,
} from "../models/product.model.js";

export async function getMenu(req: Request, res: Response) {
  /* #swagger.tags = ['Products']
  #swagger.summary = 'Lista todos los productos del menú' */
  try {
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    if (maxPrice !== undefined && isNaN(maxPrice)) {
      return res.status(400).json({ error: "maxPrice debe ser un número" });
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      return res
        .status(400)
        .json({ error: "page y limit deben ser números enteros mayores a 0" });
    }
    const products = await getAllProducts(maxPrice, page, limit);
    res.json(products);
  } catch (error) {
    console.error("[GET /api/menu]", error);
    res.status(500).json({
      error: "Error al obtener menú",
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtiene un producto por su id' */
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  try {
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("[GET /api/menu/:id]", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
}

export async function createProduct(req: Request, res: Response) {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Crea un nuevo producto'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'Agua fresca', description: 'De Jamaica', price: 25 }
     } */
  const { name, description, price } = req.body;

  try {
    const product = await insertProduct(name, description, price);
    res.status(201).json(product);
  } catch (error) {
    console.error("[POST /api/menu]", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Actualiza un producto existente'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'Agua fresca grande', description: 'De Jamaica, 1 litro', price: 35 }
     } */
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const { name, description, price } = req.body;

  try {
    const product = await updateProductInDb(id, name, description, price);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("[PUT /api/menu/:id]", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
}
