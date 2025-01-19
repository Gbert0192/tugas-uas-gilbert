import bcrypt from "bcrypt"; // Pastikan bcrypt diinstal dengan `npm install bcrypt`
import User from "../models/user.js";
import topUpHistory from "../models/topUpHistory.js";
import uuid4 from "uuid4";

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const topUpPage = async (req, res) => {
  const userId = req.cookies.userId;
  try {
    const user = await User.findOne({ where: { userId } });
    res.render("topUp/topup", {
      layout: "topup/main",
      title: "TopUp Page",
      user,
    });
  } catch (error) {
    res.status(505).json({ error: error });
  }
};

export const handleTopUp = async (req, res) => {
  const userId = req.cookies?.userId;
  const { phoneNumber, amount, password, paymentMethod } = req.body;

  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect(`/main/${userId}/topup`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.flash("error_msg", "Password is incorrect");
      return res.redirect(`/main/${userId}/topup`);
    }
    if (amount > 10000000) {
      req.flash("error_msg", "Amount is To Big!!");
      return res.redirect(`/main/${userId}/topup`);
    }
    user.balance += parseFloat(amount);
    await user.save();

    const uuid = uuid4();
    const shortUuid = uuid.split("-")[0];
    const topUpId = `TU-${shortUuid}`;

    await topUpHistory.create({
      topUpId,
      userId: user.userId,
      amount: parseInt(amount),
      paymentMethod,
    });
    req.flash("success_msg", "Top-up successful and recorded in history");
    res.redirect(`/main/${userId}`);
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Something went wrong. Please try again.");
    res.redirect(`/main/${userId}/topup`);
  }
};
