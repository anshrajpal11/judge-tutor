import mongoose from "mongoose";

const averageSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    unique: true,
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
    unique: true,
  },
  avgRating1: { type: Number, default: 0 }, 
  avgRating2: { type: Number, default: 0 }, 
  avgRating3: { type: Number, default: 0 }, 
  avgRating4: { type: Number, default: 0 }, 
  avgRating5: { type: Number, default: 0 }, 
  avgRating6: { type: Number, default: 0 }, 
  avgRating7: { type: Number, default: 0 }, 
  avgRating8: { type: Number, default: 0 }, 

  avgRating9: { type: Number, default: 0 },
  avgOverallRating: { type: Number, default: 0 },
  numberOfReviews: { type: Number, default: 0 },
});