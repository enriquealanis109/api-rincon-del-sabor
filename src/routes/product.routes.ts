import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { validateProduct } from "../middlewares/validate.product.js";

const router: Router = Router();

router.get("/menu", getMenu);
router.get("/menu/:id", getProduct);
router.post("/menu", validateProduct, createProduct);
router.put("/menu/:id", updateProduct);

export default router;
