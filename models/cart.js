import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import shoppingHistory from "./shoppingHistory.js";

const { DataTypes } = Sequelize;

const Cart = db.define(
  "cart",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false, // User ID tidak boleh kosong
      references: {
        model: "users", // Nama tabel User
        key: "userId", // Primary key dari tabel User
      },
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "cart",
  }
);

export default Cart;
