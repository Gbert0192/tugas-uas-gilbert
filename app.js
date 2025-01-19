import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import flash from "connect-flash";

// models
import db from "./config/Database.js";
import User from "./models/user.js";
import shoppingHistory from "./models/shoppingHistory.js";
import topUpHistory from "./models/topUpHistory.js";
import cart from "./models/cart.js";
import { syncAndAssociateModels } from "./models/index.js";

//routes
import authRoutes from "./routes/auth.js";
import indexRoutes from "./routes/index.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import historyRoutes from "./routes/history.js";
import profileRoutes from "./routes/profile.js";
const app = express();

// Middleware
app.use(
  session({
    secret: "sessionSecretk3y",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.password_msg = req.flash("password_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.balance_msg = req.flash("balance_msg");
  next();
});

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/main", indexRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/history", historyRoutes);
app.use("/profile", profileRoutes);
app.get("/", async (req, res) => {
  res.redirect("/main");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: 200, error: null, data: users });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.use("*", async (req, res) => {
  res.render("errors/error", {
    code: 500,
    layout: false,
    message: "FORBIDDEN CANT BE GET!",
  }); // Penutupan tanda kurung yang benar
});

(async () => {
  try {
    // buka pas sync aja
    // await db.sync({ alter: true });
    // syncAndAssociateModels();
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database:", error);
  }
})();

//server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
