import User from "./user.js";
import shoppingHistory from "./shoppingHistory.js";
import shoppingList from "./shoppingList.js"; // Typo diperbaiki
import topUpHistory from "./topUpHistory.js"; // Tambahkan .js jika diperlukan
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
export {
  User,
  shoppingList,
  topUpHistory,
  shoppingHistory,
  syncAndAssociateModels,
};
