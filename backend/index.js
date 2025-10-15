import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";

import router from "./routes/index.js";
import collegeRouter from "./routes/college.route.js";
import userRouter from "./routes/user.route.js";
import teacherRouter from "./routes/teacher.route.js";
import { connectDB } from "./utils/db.js";

// Load environment variables first
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Hugging Face API config
const HF_API_URL =
  "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

if (!HF_API_TOKEN) {
  console.error("❌ HF_API_TOKEN is missing in your .env file");
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("", router);
app.use("/college", collegeRouter);
app.use("/user", userRouter);
app.use("/teacher", teacherRouter);


app.post("/api/rating", async (req, res) => {
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ error: "Review text is required" });
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: review }),
    });

    const data = await response.json();
    console.log("Hugging Face response:", data);

    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 0) {
      const topLabel = data[0][0].label;      // e.g. "5 stars"
      const rating = parseInt(topLabel[0]);   // extract numeric rating
      res.json({ rating });
    } else if (data.error) {
      console.error("HF API returned error:", data.error);
      res.status(500).json({ error: "HF API error: " + data.error });
    } else {
      console.error("Unexpected HF response:", data);
      res.status(500).json({ error: "Unexpected response from HF API" });
    }
  } catch (err) {
    console.error("Exception while calling HF API:", err);
    res.status(500).json({ error: "Error predicting rating" });
  }
});



const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
