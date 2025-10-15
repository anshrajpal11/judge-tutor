// create user route to register
import express from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAvatar,
} from "../controller/user.controller.js";
import { isUser } from "../middlewares/auth.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

const router = express.Router();
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isUser, getCurrentUser);
router.get("/:id/avatar", getUserAvatar);
export default router;
