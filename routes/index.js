import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { productPagination } from "../controllers/productController.js";

//controller
import {
  userLoginHomePage,
  userNoLoginHomePage,
} from "../controllers/homePageController.js";

import {
  searchParams,
  searchCategories,
} from "../controllers/searchController.js";

import { topUpPage, handleTopUp } from "../controllers/topUpController.js";

const router = express.Router();

router.get("/", userNoLoginHomePage);

router.get("/:uuid", isAuthenticated, userLoginHomePage);

router.get("/:uuid/topup", isAuthenticated, topUpPage);
router.post("/:uuid/topup", isAuthenticated, handleTopUp);

router.get("/:uuid/search", isAuthenticated, searchParams);

router.get("/:uuid/category/:category", isAuthenticated, searchCategories);

router.get("/api/products", isAuthenticated, productPagination);

export default router;
