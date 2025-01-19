import User from "./user.js";
import shoppingHistory from "../models/shoppingHistory.js";
import topUpHistory from "../models/topUpHistory.js";
// import cart from "../models/cart.js";
import cart from "../models/cart.js";

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

shoppingHistory.hasMany(cart, {
  foreignKey: "orderId",
  as: "carts",
});

cart.belongsTo(shoppingHistory, {
  foreignKey: "orderId",
  as: "shoppingHistory",
});

export default () => {
  console.log("Relasi berhasil dibuat!");
};
