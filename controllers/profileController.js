import bcrypt from "bcrypt"; // Pastikan bcrypt diinstal dengan `npm install bcrypt`
import User from "../models/user.js";
import topUpHistory from "../models/topUpHistory.js";
import uuid4 from "uuid4";
import { formatCurrency } from "../utils/format.js";
import upload from "../utils/mutlerConfigs.js";

export const getProfilePage = async (req, res) => {
  const userId = req.cookies.userId;
  const user = await User.findOne({ where: { userId } });
  // console.log(user);
  res.render("profile/profile", {
    layout: "profile/main",
    title: "Profil Pengguna",
    user,
    formatCurrency,
  });
};

export const updateProfile = async (req, res) => {
  const renderError = (code, message) =>
    res.status(code).render("errors/error", {
      layout: false,
      message,
      code,
    });

  try {
    const { fullName, phoneNumber, email, age, gender, address } = req.body;
    const userId = req.cookies.userId;

    const profilePicture = req.file ? "/uploads/" + req.file.filename : null;

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).send("Pengguna tidak ditemukan.");
    }

    const updatedUser = {
      name: fullName,
      phoneNumber,
      email,
      age,
      gender,
      address,
      profilePictureUrl: profilePicture || user.profilePicture, // Gunakan foto lama jika tidak ada foto baru
    };

    await User.update(updatedUser, {
      where: { userId },
    });

    const updatedUserData = await User.findOne({ where: { userId } });

    req.flash("success_msg", "User Update successfully");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    renderError(500, "Terjadi kesalahan saat memperbarui profil.");
  }
};
