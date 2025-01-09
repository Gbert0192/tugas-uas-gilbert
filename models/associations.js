import User from "./user.js";
import shoppingHistory from "./shoppingHistory.js";
import shoppingList from "./shoppingList.js";
import topUpHistory from "./topUpHistory.js";

const associateModels = () => {
  User.hasMany(shoppingHistory, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    as: "shoppingHistories",
  });

  // Relasi User -> TopUpHistory
  User.hasMany(topUpHistory, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    as: "topUpHistories",
  });

  // Relasi ShoppingHistory -> User
  shoppingHistory.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    targetKey: "userId",
    as: "user",
  });

  // Relasi ShoppingHistory -> ShoppingList
  shoppingHistory.hasMany(shoppingList, {
    foreignKey: {
      name: "orderId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    as: "shoppingLists",
  });

  // Relasi ShoppingList -> ShoppingHistory
  shoppingList.belongsTo(shoppingHistory, {
    foreignKey: {
      name: "orderId",
      allowNull: false, // Pastikan foreign key ini wajib ada
    },
    targetKey: "orderId",
    as: "history",
  });
};

export default associateModels;
