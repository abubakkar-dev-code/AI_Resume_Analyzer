import mongoose, { Schema } from "mongoose";

const aiResultsSchema = new Schema(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    summary: {
      type: String,
    },
    strengths: {
      type: [String],
    },
    missingSkills: {
      type: [String],
    },
    weaknesses: {
      type: [String],
    },
    improvementSuggestions: {
      type: [String],
    },
    recommendedSkills: {
      type: [String],
    },
  },
  { _id: false },
);

const analysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    aiResults: {
      type: aiResultsSchema,
    },
  },
  { timestamps: true },
);

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
