import express from "express";
import User from "../models/user.js";
import isAuthenticated from "../middleware/auth.js";
import {
  searchParams,
  searchCategories,
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchParams);
router.get("/:category", searchCategories);

export default router;
