import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userId = req.cookies.userId;

    // Cek jika access token atau userId tidak ada
    if (!accessToken || !userId) {
      return res.status(401).render("errors/error", {
        layout: false,
        message: "Unauthorized - Silakan login untuk melanjutkan",
        code: "401",
        backUrl: "/auth/login",
      });
    }

    // Cek user di database
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(401).render("errors/error", {
        layout: false,
        message: "Unauthorized - User tidak ditemukan",
        code: "401",
        backUrl: "/auth/login",
      });
    }

    // Verifikasi access token
    try {
      const decoded = jwt.verify(accessToken, accessTokenSecret);
      req.user = decoded; // Simpan payload token ke request
      return next();
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        return res.status(403).render("errors/error", {
          layout: false,
          message: "Forbidden - Token tidak valid",
          code: "403",
        });
      }
    }

    // Access token kadaluarsa, cek refresh token
    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      return res.status(403).render("errors/error", {
        layout: false,
        message: "Forbidden - Anda tidak memiliki akses",
        code: "403",
      });
    }

    // Verifikasi refresh token
    try {
      const decodedRefresh = jwt.verify(refreshToken, refreshTokenSecret);

      // Buat access token baru jika refresh token valid
      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id, userId: decodedRefresh.userId },
        accessTokenSecret,
        { expiresIn: "15m" } // 15 menit
      );

      // Set access token baru sebagai cookie
      res.cookie("accessToken", newAccessToken, { httpOnly: true });
      req.user = decodedRefresh;
      return next(); // Lanjutkan ke middleware berikutnya setelah membuat token baru
    } catch (err) {
      return res.status(403).render("errors/error", {
        layout: false,
        message: "Session expired. Please log in again.",
        code: "403",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/error", {
      layout: false,
      message: "Internal Server Error",
      code: "500",
    });
  }
};

export default isAuthenticated;
