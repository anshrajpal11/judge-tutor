import User from "../models/user.model.js";
import mongoose from "mongoose";
import College from "../models/collage.model.js";
import Teacher from "../models/teacher.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

import Review from "../models/review.model.js";

export const registerUser = async (req, res) => {
  const { name, email, password, collegeName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const college = await College.findOne({ name: collegeName });
    if (!college) {
      return res.status(400).json({ message: "College not found" });
    }
    const collegeId = college._id;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      collageId: collegeId,
      reviews: [],
    });

    if (req.file && req.file.buffer) {
      newUser.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    const roleCookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("role", "student", roleCookieOptions);

    const userObj = newUser.toObject();
    delete userObj.password;

    if (userObj.profilePicture && userObj.profilePicture.data) {
      const base64 = userObj.profilePicture.data.toString("base64");
      userObj.profilePicture = `data:${userObj.profilePicture.contentType};base64,${base64}`;
    }
    res
      .status(201)
      .json({ message: "User registered successfully", user: userObj });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // Set cookie options so that cookies are sent in cross-site requests from the
    // deployed frontend. In production we must set Secure and SameSite=None.
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    const roleCookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };

    res.cookie("role", "student", roleCookieOptions);

    res
      .status(200)
      .json({ token, role: "student", message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const registerTeacher = async (req, res) => {
  if (!req.body) {
    console.error("registerTeacher: missing req.body; headers:", req.headers);
    return res.status(400).json({
      message:
        "Request body missing; ensure you're sending multipart/form-data and multer middleware is applied.",
    });
  }
  const {
    name,
    email,
    password,
    collageName,
    subject,
    subjects,
    description,
    achievements,
    experience,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const college = await College.findOne({ name: collageName });
    if (!college) {
      return res.status(400).json({ message: "College not found" });
    }

    const achievementsArray = achievements
      ? achievements.split(",").map((item) => item.trim())
      : [];

    let subjectsArray = [];
    if (Array.isArray(subjects))
      subjectsArray = subjects.map((s) => String(s).trim()).filter(Boolean);
    else if (typeof subjects === "string" && subjects.trim().length > 0)
      subjectsArray = subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    else if (subject) subjectsArray = [String(subject).trim()];

    if (subjectsArray.length === 0)
      return res
        .status(400)
        .json({ message: "Please provide at least one subject" });
    if (!description || description.trim().length === 0)
      return res.status(400).json({ message: "Please provide a description" });

    const collegeId = college._id;
    const newUser = new Teacher({
      name,
      email,
      password: hashedPassword,
      collageId: collegeId,
      subject: subject || subjectsArray[0] || "",
      subjects: subjectsArray,
      description: description || "",
      achievements: achievementsArray,
      experience,
      review: [],
    });

    if (req.file && req.file.buffer) {
      newUser.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    const roleCookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("role", "teacher", roleCookieOptions);

    const teacherObj = newUser.toObject();
    delete teacherObj.password;
    if (teacherObj.profilePicture && teacherObj.profilePicture.data) {
      const base64 = teacherObj.profilePicture.data.toString("base64");
      teacherObj.profilePicture = `data:${teacherObj.profilePicture.contentType};base64,${base64}`;
    }
    res
      .status(201)
      .json({ message: "Teacher registered successfully", user: teacherObj });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: teacher._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    const roleCookieOptions = {
      httpOnly: false, // role can be read by frontend if needed
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 60 * 60 * 1000,
    };
    res.cookie("role", "teacher", roleCookieOptions);

    res
      .status(200)
      .json({ token, role: "teacher", message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(userId)
      .select("-password -__v")
      .populate("collageId")
      .populate({
        path: "reviews",
        populate: { path: "teacherId", select: "name collageId subjects" },
      });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user id" });
    const user = await User.findById(id).select("profilePicture");
    if (!user || !user.profilePicture || !user.profilePicture.data)
      return res.status(404).json({ message: "User avatar not found" });
    const contentType = user.profilePicture.contentType || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000");
    return res.status(200).send(user.profilePicture.data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getTeacherAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid teacher id" });
    const teacher = await Teacher.findById(id).select("profilePicture");
    if (!teacher || !teacher.profilePicture || !teacher.profilePicture.data)
      return res.status(404).json({ message: "Teacher avatar not found" });
    const contentType = teacher.profilePicture.contentType || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000");
    return res.status(200).send(teacher.profilePicture.data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("collageId");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear cookies using same options as when they were set so browsers accept the
    // deletion for cross-site cookies.
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    };
    res.clearCookie("token", clearOptions);
    // role cookie wasn't httpOnly when set; clear without httpOnly true so it matches
    const clearRoleOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    };
    res.clearCookie("role", clearRoleOptions);
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Teacher id is required" });

    const teacher = await Teacher.findById(id)
      .populate("collageId")
      .populate({ path: "review" });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const total = teacher.review ? teacher.review.length : 0;
    const computeAverages = () => {
      if (!total) return { overall: 0, byCategory: {} };
      const keys = [
        "overallRating",
        "knowledgeRating",
        "communicationRating",
        "explanationRating",
        "availabilityRating",
        "gradingRating",
        "engagementRating",
        "preparationRating",
        "approachabilityRating",
        "feedbackRating",
      ];
      const sums = {};
      keys.forEach((k) => (sums[k] = 0));
      teacher.review.forEach((r) => {
        keys.forEach((k) => {
          sums[k] += r[k] || 0;
        });
      });
      const byCategory = {
        knowledge: Number((sums["knowledgeRating"] / total).toFixed(2)),
        communication: Number((sums["communicationRating"] / total).toFixed(2)),
        explanation: Number((sums["explanationRating"] / total).toFixed(2)),
        availability: Number((sums["availabilityRating"] / total).toFixed(2)),
        grading: Number((sums["gradingRating"] / total).toFixed(2)),
        engagement: Number((sums["engagementRating"] / total).toFixed(2)),
        preparation: Number((sums["preparationRating"] / total).toFixed(2)),
        approachability: Number(
          (sums["approachabilityRating"] / total).toFixed(2)
        ),
        feedback: Number((sums["feedbackRating"] / total).toFixed(2)),
      };
      const overall = Number((sums["overallRating"] / total).toFixed(2));
      return { overall, byCategory };
    };

    const aggregates = computeAggregates(teacher.review || []);

    const teacherObj = teacher.toObject();
    teacherObj.averageRating = teacher.averageRating || aggregates.overall || 0;
    teacherObj.categoryAverages =
      teacher.categoryAverages && Object.keys(teacher.categoryAverages).length
        ? teacher.categoryAverages
        : aggregates.byCategory;
    teacherObj.totalReviews = teacher.totalReviews || total;

    teacherObj.location = teacher.location || teacher.collageId?.address || "";

    res.status(200).json(teacherObj);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      overallRating,
      knowledgeRating,
      communicationRating,
      explanationRating,
      availabilityRating,
      gradingRating,
      engagementRating,
      preparationRating,
      approachabilityRating,
      feedbackRating,
      comment,
      universityId,
    } = req.body;

    if (!id) return res.status(400).json({ message: "Teacher id required" });
    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const ratingFields = {
      overallRating,
      knowledgeRating,
      communicationRating,
      explanationRating,
      availabilityRating,
      gradingRating,
      engagementRating,
      preparationRating,
      approachabilityRating,
      feedbackRating,
    };

    for (const [key, value] of Object.entries(ratingFields)) {
      if (typeof value === "undefined" || value === null)
        return res.status(400).json({ message: `${key} is required` });
      const num = Number(value);
      if (Number.isNaN(num) || num < 1 || num > 5)
        return res
          .status(400)
          .json({ message: `${key} must be a number between 1 and 5` });
    }

    const newReview = new Review({
      teacherId: id,
      universityId: universityId || teacher.collageId,
      userId: req.userId || null,
      overallRating,
      knowledgeRating,
      knowledgeReview: req.body.knowledgeReview || "",
      communicationRating,
      communicationReview: req.body.communicationReview || "",
      explanationRating,
      explanationReview: req.body.explanationReview || "",
      availabilityRating,
      availabilityReview: req.body.availabilityReview || "",
      gradingRating,
      gradingReview: req.body.gradingReview || "",
      engagementRating,
      engagementReview: req.body.engagementReview || "",
      preparationRating,
      preparationReview: req.body.preparationReview || "",
      approachabilityRating,
      approachabilityReview: req.body.approachabilityReview || "",
      feedbackRating,
      feedbackReview: req.body.feedbackReview || "",
      comment: comment || "",
    });

    await newReview.save();

    teacher.review = teacher.review || [];
    teacher.review.push(newReview._id);

    const reviews = await Review.find({ teacherId: id });
    const aggregates = computeAggregates(reviews || []);

    teacher.averageRating = aggregates.overall;
    teacher.categoryAverages = aggregates.byCategory;
    teacher.totalReviews = reviews.length;
    await teacher.save();

    try {
      const userId = req.userId;
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          user.reviews = user.reviews || [];
          user.reviews.push(newReview._id);
          await user.save();
        }
      }
    } catch (e) {
      console.warn("Failed to attach review to user profile:", e.message);
    }
    const populatedTeacher = await Teacher.findById(id)
      .populate("collageId")
      .populate({
        path: "review",
        populate: { path: "userId", select: "name email" },
      });

    return res.status(201).json({ teacher: populatedTeacher, aggregates });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const computeAggregates = (reviews) => {
  const total = reviews.length || 0;
  const keys = [
    "overallRating",
    "knowledgeRating",
    "communicationRating",
    "explanationRating",
    "availabilityRating",
    "gradingRating",
    "engagementRating",
    "preparationRating",
    "approachabilityRating",
    "feedbackRating",
  ];

  const sentimentScore = (text) => {
    if (!text || typeof text !== "string") return 0;
    const t = text.toLowerCase();
    const pos = [
      "good",
      "great",
      "excellent",
      "amazing",
      "love",
      "helpful",
      "clear",
      "friendly",
      "best",
      "recommended",
      "positive",
      "awesome",
    ];
    const neg = [
      "bad",
      "poor",
      "terrible",
      "hate",
      "confusing",
      "rude",
      "worst",
      "late",
      "unhelpful",
      "disappointing",
      "negative",
    ];
    let score = 0;
    pos.forEach((w) => (score += t.includes(w) ? 1 : 0));
    neg.forEach((w) => (score -= t.includes(w) ? 1 : 0));

    if (score > 3) score = 3;
    if (score < -3) score = -3;
    return score / 3;
  };

  if (!total) {
    return { overall: 0, byCategory: {} };
  }

  const sums = {};
  keys.forEach((k) => (sums[k] = 0));

  const perReviewScores = [];

  reviews.forEach((r) => {
    const numericKeys = keys.filter((k) => k !== "overallRating");
    const numericSum = numericKeys.reduce(
      (acc, k) => acc + (Number(r[k]) || 0),
      0
    );
    const numericAvg = numericSum / numericKeys.length;
    let textAggregate = 0;
    const textFields = [
      r.comment,
      r.knowledgeReview,
      r.communicationReview,
      r.explanationReview,
      r.availabilityReview,
      r.gradingReview,
      r.engagementReview,
      r.preparationReview,
      r.approachabilityReview,
      r.feedbackReview,
    ];
    textFields.forEach((tf) => {
      textAggregate += sentimentScore(tf);
    });

    const avgSentiment = textAggregate / textFields.length;

    const sentimentBonus = avgSentiment * 0.25;
    const overallRating = Number(r.overallRating) || numericAvg;

    const perScore = Math.min(
      5,
      Math.max(1, (numericAvg + overallRating) / 2 + sentimentBonus)
    );

    perReviewScores.push(perScore);

    keys.forEach((k) => {
      sums[k] += Number(r[k]) || 0;
    });
  });

  const overall = Number(
    (
      perReviewScores.reduce((a, b) => a + b, 0) / perReviewScores.length
    ).toFixed(2)
  );

  const byCategory = {
    knowledge: Number((sums["knowledgeRating"] / total).toFixed(2)),
    communication: Number((sums["communicationRating"] / total).toFixed(2)),
    explanation: Number((sums["explanationRating"] / total).toFixed(2)),
    availability: Number((sums["availabilityRating"] / total).toFixed(2)),
    grading: Number((sums["gradingRating"] / total).toFixed(2)),
    engagement: Number((sums["engagementRating"] / total).toFixed(2)),
    preparation: Number((sums["preparationRating"] / total).toFixed(2)),
    approachability: Number((sums["approachabilityRating"] / total).toFixed(2)),
    feedback: Number((sums["feedbackRating"] / total).toFixed(2)),
  };

  return { overall, byCategory };
};
