import express from "express";
import {isAuth} from "../Middleware/isAuth.js";
import { uploadFiles} from "../Middleware/Multer.js";
import { createProduct, deleteProducts, fetchAllProducts,fetchSingleProducts } from "../Controllers/Product.js";

const router= express.Router();
router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all-products", fetchAllProducts);
router.get("/product/single/:id", fetchSingleProducts);
router.delete("/product/:id",isAuth, deleteProducts);
export default router;