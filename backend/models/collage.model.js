import mongoose from "mongoose";

const collageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  establishedYear: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
});

const College = mongoose.model("College", collageSchema);

export default College;