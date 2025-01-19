import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const topUpHistory = db.define(
  "topUpHistory",
  {
    topUpId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      foreignKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("Credit", "Debit", "PayPal"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "topUpHistory",
    timestamps: true,
  }
);

export default topUpHistory;
