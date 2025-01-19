import isAuthenticated from "../middleware/auth.js";
import {
  addToCart,
  getCartItem,
  updateCart,
} from "../controllers/cartController.js";
import express from "express";

const router = express.Router();

router.post("/add-to-cart", isAuthenticated, addToCart);
router.post("/update-cart", isAuthenticated, updateCart);
router.get("/get-cart", isAuthenticated, getCartItem);
export default router;
