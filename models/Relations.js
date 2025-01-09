import User from "./user.js";
import shoppingHistory from "../models/shoppingHistory.js";
import topUpHistory from "../models/topUpHistory.js";
import shoppingList from "../models/shoppingList.js";

// Relasi antar model
User.hasMany(shoppingHistory, {
  foreignKey: "userId",
  as: "shoppingHistories",
});

User.hasMany(topUpHistory, {
  foreignKey: "userId",
  as: "topUpHistories",
});

shoppingHistory.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

shoppingHistory.hasMany(shoppingList, {
  foreignKey: "orderId",
  as: "shoppingLists",
});

shoppingList.belongsTo(shoppingHistory, {
  foreignKey: "orderId",
  as: "shoppingHistory",
});

export default () => {
  console.log("Relasi berhasil dibuat!");
};
