import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    licenseNumber: String,
    assignedAmbulance: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    status: { type: String, enum: ["available", "on_trip", "offline"], default: "available" }
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
