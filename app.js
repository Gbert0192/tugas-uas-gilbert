import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import cookieParser from "cookie-parser";
import uuid4 from "uuid4";

// models
import db from "./config/Database.js";
import User from "./models/user.js";
import shoppingHistory from "./models/shoppingHistory.js";
import topUpHistory from "./models/topUpHistory.js";
import shoppingList from "./models/shoppingList.js";
import { syncAndAssociateModels } from "./models/index.js";
//models end

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret aja",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/register", async (req, res) => {
  try {
    const { phoneNumber, email, name, password } = req.body;
    const users = await User.create({
      userId: uuid4(),
      phoneNumber,
      email,
      name,
      password,
    });
    res.status(200).json({ status: 200, error: null, data: users });
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: 200, error: null, data: users });
  } catch (error) {
    res.status(400).json({ error });
  }
});
// database start

(async () => {
  try {
    // await db.sync({ alter: true });
    // syncAndAssociateModels();
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database:", error);
  }
})();
// database end

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
