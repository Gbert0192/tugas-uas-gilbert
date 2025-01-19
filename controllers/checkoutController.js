import User from "../models/user.js";
import Cart from "../models/cart.js";
import shoppingHistory from "../models/shoppingHistory.js";
import getRandomDelivery from "../utils/randomDelivery.js";
import { formatCurrency } from "../utils/format.js";
import generateOrderCode from "../utils/generateOrderCode.js";
import bcrypt from "bcrypt";

export const checkOutPage = async (req, res) => {
  const userId = req.cookies.userId;

  const renderError = (code, message) =>
    res.status(code).render("errors/error", {
      layout: false,
      message,
      code,
    });

  try {
    const orderFee = 2700;
    const storeFee = 3000;
    const user = await User.findOne({ where: { userId } });
    const cart = await Cart.findAll({ where: { userId, orderId: null } });

    if (!user) {
      return renderError(404, "User not found");
    }

    let total = 0;
    cart.forEach((item) => {
      const productPrice = parseFloat(item.dataValues.productPrice);
      const quantity = item.dataValues.quantity;
      total += productPrice * quantity;
    });

    res.render("checkout/checkout", {
      layout: false,
      title: "Checkout Product",
      user,
      cart,
      total,
      delivery: getRandomDelivery(),
      orderFee,
      storeFee,
      formatCurrency,
      userBalance: user.balance,
    });
  } catch (error) {
    renderError(500, "Page Error!");
  }
};

export const confirmCheckout = async (req, res) => {
  const userId = req.cookies.userId;
  const {
    userAddress,
    userAddressDetails,
    paymentMethod,
    password,
    shoppingTotal,
    driverNotes,
  } = req.body;

  const renderError = (code, message) =>
    res.status(code).render("errors/error", {
      layout: false,
      message,
      code,
    });

  try {
    const user = await User.findOne({ where: { userId } });
    console.log(shoppingTotal);

    if (!userAddress || !userAddressDetails || !paymentMethod) {
      req.flash("error_msg", "Please Input The Address");
      return res.redirect(`/checkout/${userId}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.flash("password_msg", "Password Invalid");
      return res.redirect(`/checkout/${userId}`);
    }
    if (paymentMethod === "balance") {
      if (shoppingTotal > user.balance) {
        req.flash("balance_msg", "Your Balance is Insufficient");
        return res.redirect(`/checkout/${userId}`);
      }
      user.balance -= shoppingTotal;
      user.save();
      let orderCode = generateOrderCode();
      await shoppingHistory.create({
        orderId: orderCode,
        userId: userId,
        driverNotes: driverNotes || null,
        shoppingTotal: shoppingTotal,
        userAddress: userAddress,
        userAddressDetails: userAddressDetails,
        paymentMethod: paymentMethod,
      });
      const cart = await Cart.findAll({ where: { userId, orderId: null } });
      for (let item of cart) {
        item.orderId = orderCode;
        await item.save();
      }

      res.render("checkout/checkoutDone", { layout: false, user });
    }

    // kalau tunai
    let orderCode = generateOrderCode();
    await shoppingHistory.create({
      orderId: orderCode,
      userId: userId,
      driverNotes: driverNotes || null,
      shoppingTotal: shoppingTotal,
      userAddress: userAddress,
      userAddressDetails: userAddressDetails,
      paymentMethod: paymentMethod,
    });
    const cart = await Cart.findAll({ where: { userId, orderId: null } });
    for (let item of cart) {
      item.orderId = orderCode;
      await item.save();
    }

    res.render("checkout/checkoutDone", { layout: false, user });
  } catch (error) {
    renderError(500, error);
  }
};
