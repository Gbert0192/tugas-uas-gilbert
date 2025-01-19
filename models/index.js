import User from "./user.js";
import shoppingHistory from "./shoppingHistory.js";
import topUpHistory from "./topUpHistory.js"; // Tambahkan .js jika diperlukan
import Cart from "./cart.js";
import associateModels from "./associations.js";
import db from "../config/Database.js";
const syncAndAssociateModels = async () => {
  try {
    associateModels();
    await db.sync({ alter: true });
  } catch (error) {
    console.log("gagal", error);
  }
};
export { User, topUpHistory, shoppingHistory, syncAndAssociateModels, Cart };
