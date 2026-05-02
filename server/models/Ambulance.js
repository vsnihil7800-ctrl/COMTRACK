import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    driverName: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    phone: String,
    status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    location: {
      lat: Number,
      lng: Number
    },
    coverageRadiusKm: { type: Number, default: 15 }
  },
  { timestamps: true }
);

export default mongoose.model("Ambulance", ambulanceSchema);
