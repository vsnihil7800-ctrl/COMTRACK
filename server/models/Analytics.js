import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
