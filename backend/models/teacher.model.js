import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 
  subjects: { type: [String], default: [] },

  description: { type: String, default: "" },
  experience: { type: Number, required: true },
  achievements: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  collageId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  
  averageRating: { type: Number, default: 0 },
  categoryAverages: { type: Object, default: {} },
  totalReviews: { type: Number, default: 0 },
 
  profilePicture: {
    data: { type: Buffer },
    contentType: { type: String },
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
