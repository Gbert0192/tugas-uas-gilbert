import User from "../models/user.js";
import Cart from "../models/cart.js";
import shoppingHistory from "../models/shoppingHistory.js";
import topUpHistory from "../models/topUpHistory.js";

import { priceToIdr, formatCurrency } from "../utils/format.js";

export const productHistoryPage = async (req, res) => {
  const userId = req.cookies.userId;
  try {
    const history = await shoppingHistory.findAll({
      where: { userId },
    });

    const historyWithCart = [];
    for (const t of history) {
      const cart = await Cart.findAll({
        where: { userId, orderId: t.orderId },
      });
      historyWithCart.push({ ...t.toJSON(), cart });
    }
    const user = await User.findOne({ where: { userId: userId } });
    res.render("history/productHistory", {
      layout: "history/main",
      title: "History",
      user,
      history: historyWithCart,
      priceToIdr,
      formatCurrency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

export const topUpHistoryPage = async (req, res) => {
  const userId = req.cookies.userId;
  try {
    const history = await topUpHistory.findAll({ where: { userId } });
    const user = await User.findOne({ where: { userId: userId } });

    const topUpHistoryToCart = [];
    for (const t of history) {
      topUpHistoryToCart.push({ ...t.toJSON() });
    }

    res.render("history/topUpHistory", {
      layout: "history/main",
      title: "History",
      user,
      priceToIdr,
      formatCurrency,
      topUpHistory: topUpHistoryToCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};
