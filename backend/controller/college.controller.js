
import College from "../models/collage.model.js";

export const createCollege = async (req, res) => {
  const { name, address, establishedYear } = req.body;
  try {
    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists" });
    }
    const newCollege = new College({ name, address, establishedYear });
    await newCollege.save();
    res
      .status(201)
      .json({ message: "College created successfully", college: newCollege });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({}).sort({ name: 1 });
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
