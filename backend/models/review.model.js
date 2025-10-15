import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  // user who submitted the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  // overall rating (1-5)
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  // 1. Knowledge of the subject
  knowledgeRating: { type: Number, required: true, min: 1, max: 5 },
  knowledgeReview: { type: String },
  // 2. Communication style
  communicationRating: { type: Number, required: true, min: 1, max: 5 },
  communicationReview: { type: String },
  // 3. Explaining complex concepts
  explanationRating: { type: Number, required: true, min: 1, max: 5 },
  explanationReview: { type: String },
  // 4. Availability for questions and help
  availabilityRating: { type: Number, required: true, min: 1, max: 5 },
  availabilityReview: { type: String },
  // 5. Fairness and consistency in grading
  gradingRating: { type: Number, required: true, min: 1, max: 5 },
  gradingReview: { type: String },
  // 6. Engagement and interactivity of classes
  engagementRating: { type: Number, required: true, min: 1, max: 5 },
  engagementReview: { type: String },
  // 7. Preparation for lectures
  preparationRating: { type: Number, required: true, min: 1, max: 5 },
  preparationReview: { type: String },
  // 8. Approachability and friendliness
  approachabilityRating: { type: Number, required: true, min: 1, max: 5 },
  approachabilityReview: { type: String },
  // 9. Providing feedback
  feedbackRating: { type: Number, required: true, min: 1, max: 5 },
  feedbackReview: { type: String },
  // 10. Optional overall detailed review
  comment: { type: String },

  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
