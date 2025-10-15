// teacher register route
import express from "express";
import multer from "multer";
import {
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacherById,
  createReview,
  getTeacherAvatar,
} from "../controller/user.controller.js";
import { isUser } from "../middlewares/auth.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

const router = express.Router();
// Accept an optional single file field named 'profilePicture'
router.post("/register", upload.single("profilePicture"), registerTeacher);
router.post("/login", loginTeacher);
router.get("/all", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/:id/review", isUser, createReview);
router.get("/:id/avatar", getTeacherAvatar);

export default router;
