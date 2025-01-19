import User from "./user.js";
import shoppingHistory from "./shoppingHistory.js";
import cart from "./cart.js";
import topUpHistory from "./topUpHistory.js";

const associateModels = () => {
  // Relasi User -> ShoppingHistory
  User.hasMany(shoppingHistory, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    as: "shoppingHistories", // Unique alias
  });

  // Relasi User -> TopUpHistory
  User.hasMany(topUpHistory, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    as: "topUpHistories", // Unique alias
  });

  // Relasi ShoppingHistory -> User
  shoppingHistory.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    targetKey: "userId",
    as: "user", // Unique alias
  });

  // Relasi ShoppingHistory -> Cart
  shoppingHistory.hasMany(cart, {
    foreignKey: {
      name: "orderId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    as: "shoppingHistoryCarts", // Unique alias
  });

  // Relasi Cart -> ShoppingHistory
  cart.belongsTo(shoppingHistory, {
    foreignKey: {
      name: "orderId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    targetKey: "orderId",
    as: "shoppingHistory", // Unique alias
  });
};

export default associateModels;
