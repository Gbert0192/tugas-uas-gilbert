import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {
  getProfilePage,
  updateProfile,
} from "../controllers/profileController.js";
import multer from "multer";
import path from "path";

// Import router
const router = express.Router();

// Konfigurasi Multer (sesuaikan dengan konfigurasi Anda)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Pastikan folder uploads ada
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Ambil ekstensi file
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

router.get("/", isAuthenticated, getProfilePage);
router.post(
  "/",
  isAuthenticated,
  upload.single("profile_picture"),
  updateProfile
);

export default router;
