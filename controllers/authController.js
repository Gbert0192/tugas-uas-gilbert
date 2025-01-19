import User from "../models/user.js";
import bcrypt from "bcrypt";
import uuid4 from "uuid4";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Mencari user berdasarkan nomor HP
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      req.flash("error", "User tidak ditemukan");
      return res.redirect("/auth/login");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password yang dimasukkan:", password);
    console.log("Password yang disimpan:", user.password);
    if (!isPasswordValid) {
      req.flash("phoneNumber", phoneNumber);
      req.flash("error", "Password salah");
      return res.redirect("/auth/login");
    }

    // Membuat Access Token
    const accessToken = jwt.sign(
      { id: user.userId, phoneNumber: user.phoneNumber },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
    console.log("auth control", process.env.ACCESS_TOKEN_SECRET);
    console.log("auth control", process.env.REFRESH_TOKEN_SECRET);

    // Membuat Refresh Token
    const refreshToken = jwt.sign(
      { id: user.userId, phoneNumber: user.phoneNumber },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    // Menyimpan Refresh Token ke dalam database
    if (!user.refreshToken) {
      user.refreshToken = refreshToken;
      await user.save();
    }

    // Menyimpan Access Token ke dalam cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 jam
    });

    // Menyimpan userId ke dalam cookie
    res.cookie("userId", user.userId, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 jam
    });

    // Redirect ke halaman utama user
    res.redirect(`/main/${user.userId}`);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message, data: null });
  }
};

export const userRegister = async (req, res) => {
  const { phoneNumber, email, name, password, confirmPassword } = req.body;

  try {
    // Validasi password dan konfirmasi password
    if (password !== confirmPassword) {
      req.flash("warning_msg", "Password Unmatch");
      return res.redirect("/auth/register");
    }

    // Validasi panjang password
    if (password.length < 6 || password.length > 25) {
      req.flash("warning_msg", "Password Too Short, 6-25 characters!");
      return res.redirect("/auth/register");
    }

    // Cek apakah nomor telepon sudah terdaftar
    const existingPhoneNumber = await User.findOne({
      where: { phoneNumber },
    });
    if (existingPhoneNumber) {
      req.flash("warning_msg", "Phone Number already registered");
      return res.redirect("/auth/register");
    }

    // Cek apakah email sudah terdaftar
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      req.flash("warning_msg", "Email already registered");
      return res.redirect("/auth/register");
    }

    // Hash password sebelum disimpan
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat UUID untuk user baru
    const userUUID = uuid4();
    const user = await User.create({
      userId: userUUID,
      phoneNumber,
      email,
      name,
      password: hashedPassword,
    });

    req.flash("success_msg", "User registered successfully");
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("error_msg", "An error occurred during registration");
    res.redirect("/auth/register");
  }
};

export const userLogout = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: "User not logged in." });
    }

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("userId");

    return res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      error: error.message || "Internal server error",
      data: null,
    });
  }
};
