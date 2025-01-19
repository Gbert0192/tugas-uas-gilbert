import isAuthenticated from "../middleware/auth.js";
import {
  checkOutPage,
  confirmCheckout,
} from "../controllers/checkoutController.js";

import express from "express";

const router = express.Router();

router.get("/:uuid", checkOutPage);
router.post("/:uuid/confirm", confirmCheckout);
export default router;
