import express from "express";
import { connectDB } from "../utils/db.js";


const router = express.Router();

router.get("/", async (req, res) => {
  await connectDB();
  res.send("API is running...");
});

export default router;