import express from "express";
import User from "../models/user.js";
const router = express.Router();

import {
  userLogin,
  userRegister,
  userLogout,
} from "../controllers/authController.js";

//controller
import {
  loginPage,
  registerPage,
  registerData,
} from "../controllers/loginPageController.js";
router.get("/login", loginPage);
router.post("/login", userLogin);
router.get("/register", registerPage);

router.post("/register-data", registerData);

router.post("/register", userRegister);

router.post("/logout", userLogout);
export default router;
