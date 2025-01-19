import express from "express";
import User from "../models/user.js";
import isAuthenticated from "../middleware/auth.js";

import {
  productHistoryPage,
  topUpHistoryPage,
} from "../controllers/historyController.js";
const router = express.Router();

router.get("/productHistory", isAuthenticated, productHistoryPage);
router.get("/topUpHistory", isAuthenticated, topUpHistoryPage);

export default router;
