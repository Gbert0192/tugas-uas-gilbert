import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const shoppingHistory = db.define(
  "shoppingHistory",
  {
    orderId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAddressDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverNotes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "-",
    },
    shoppingTotal: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "shoppingHistory",
    timestamps: true,
  }
);

export default shoppingHistory;
