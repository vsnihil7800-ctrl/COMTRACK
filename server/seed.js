import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Complaint from "./models/Complaint.js";
import Booking from "./models/Booking.js";
import SOSAlert from "./models/SOSAlert.js";
import Ambulance from "./models/Ambulance.js";

dotenv.config();

async function run() {
  await connectDB(process.env.MONGO_URI);

  const adminEmail = "admin@comtrack.app";
  const adminExists = await User.findOne({ email: adminEmail });
  let admin = adminExists;
  if (!adminExists) {
    admin = await User.create({
      name: "COMTRACK Admin",
      email: adminEmail,
      password: await bcrypt.hash("Admin@12345", 12),
      role: "admin",
      emailVerified: true
    });
  }

  if ((await Ambulance.countDocuments()) === 0) {
    await Ambulance.insertMany([
      { driverName: "Arun Kumar", vehicleNumber: "TN01AB1234", status: "available", location: { lat: 13.0827, lng: 80.2707 } },
      { driverName: "Priya Devi", vehicleNumber: "TN02CD5678", status: "available", location: { lat: 13.091, lng: 80.282 } }
    ]);
  }

  if ((await Complaint.countDocuments()) === 0) {
    await Complaint.insertMany([
      {
        ticketId: "CMP12345",
        user: admin._id,
        fullName: "Sample Citizen",
        email: "citizen@example.com",
        city: "Chennai",
        description: "Garbage not collected in my street for 3 days.",
        category: "garbage",
        aiDepartment: "Municipality",
        status: "assigned"
      }
    ]);
  }

  if ((await Booking.countDocuments()) === 0) {
    await Booking.create({
      user: admin._id,
      pickup: { address: "T Nagar, Chennai", lat: 13.0418, lng: 80.2337 },
      status: "on_the_way",
      etaMinutes: 5,
      distanceKm: 2.1,
      responseTimeMinutes: 4,
      priceEstimate: 699
    });
  }

  if ((await SOSAlert.countDocuments()) === 0) {
    await SOSAlert.create({
      user: admin._id,
      emergencyType: "medical",
      locationName: "Chennai Central",
      location: { lat: 13.0827, lng: 80.2707, address: "Chennai Central" },
      status: "responder_assigned"
    });
  }

  console.log("Seed complete");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
