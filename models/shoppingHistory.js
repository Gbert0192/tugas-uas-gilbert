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
    driverNotes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "-",
    },
    shoppingTotal: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    payment: {
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
