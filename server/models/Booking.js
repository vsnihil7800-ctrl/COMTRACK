import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ambulance: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    pickup: { address: String, lat: Number, lng: Number },
    destination: { address: String, lat: Number, lng: Number },
    etaMinutes: Number,
    distanceKm: Number,
    priceEstimate: Number,
    responseTimeMinutes: Number,
    routePolyline: String,
    status: {
      type: String,
      enum: ["searching", "assigned", "on_the_way", "arrived", "completed"],
      default: "searching"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
