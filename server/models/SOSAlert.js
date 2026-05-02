import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    emergencyType: {
      type: String,
      enum: ["medical", "fire", "crime", "accident", "women_safety", "natural_disaster"],
      required: true
    },
    location: { lat: Number, lng: Number, address: String },
    locationName: String,
    silentMode: { type: Boolean, default: false },
    evidenceUrl: String,
    status: {
      type: String,
      enum: ["alert_sent", "responder_assigned", "help_on_the_way", "resolved"],
      default: "alert_sent"
    }
  },
  { timestamps: true }
);

export default mongoose.model("SOSAlert", sosAlertSchema);
