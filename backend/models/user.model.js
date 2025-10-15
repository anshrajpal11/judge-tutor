import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, default: Date.now },
  collageId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  
  profilePicture: {
    data: { type: Buffer },
    contentType: { type: String },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
