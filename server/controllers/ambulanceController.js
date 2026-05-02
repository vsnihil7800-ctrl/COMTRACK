import Ambulance from "../models/Ambulance.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import { suggestETA } from "../utils/ai.js";
import { getDirections } from "../utils/mapbox.js";

export async function nearbyAmbulance(req, res) {
  const ambulances = await Ambulance.find({ status: "available" }).limit(10);
  const enriched = ambulances.map((a, idx) => ({
    ...a.toObject(),
    distanceKm: Number((1.5 + idx * 0.8).toFixed(1)),
    etaMinutes: suggestETA(1.5 + idx * 0.8),
    priceEstimate: 499 + idx * 110
  }));
  res.json(enriched);
}

export async function bookAmbulance(req, res) {
  const available = await Ambulance.findOne({ status: "available" });
  const fallbackStart = available?.location || { lat: 13.0827, lng: 80.2707 };
  const pickup = req.body.pickup || { address: "Unknown pickup", lat: 13.09, lng: 80.28 };
  const direction = await getDirections({
    startLng: fallbackStart.lng,
    startLat: fallbackStart.lat,
    endLng: pickup.lng || 80.28,
    endLat: pickup.lat || 13.09
  });
  const routeCoordinates = direction?.coordinates || [
    [fallbackStart.lng, fallbackStart.lat],
    [80.276, 13.086],
    [80.285, 13.09]
  ];
  const booking = await Booking.create({
    user: req.user._id,
    ambulance: available?._id,
    pickup,
    destination: req.body.destination,
    etaMinutes: direction?.etaMinutes || 6,
    distanceKm: direction?.distanceKm || 2.4,
    priceEstimate: 699,
    responseTimeMinutes: 5,
    routePolyline: routeCoordinates.map(([lng, lat]) => `${lat},${lng}`).join(";"),
    status: available ? "assigned" : "searching"
  });
  if (available) {
    available.status = "busy";
    await available.save();
  }
  await Notification.create({
    user: req.user._id,
    title: "Ambulance booking created",
    message: `Status: ${booking.status}`,
    type: "booking"
  });
  req.io.to(String(req.user._id)).emit("notification", { title: "Booking update", message: booking.status });
  req.io.to("role:admin").emit("booking:new", booking);
  res.status(201).json(booking);
}

export async function trackBooking(req, res) {
  const booking = await Booking.findById(req.params.id).populate("ambulance");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
}

export async function nearbyServices(req, res) {
  const { lat = 13.0827, lng = 80.2707 } = req.query;
  const baseLat = Number(lat);
  const baseLng = Number(lng);
  const mk = (name, kind, shift) => ({
    name,
    kind,
    lat: Number((baseLat + shift).toFixed(5)),
    lng: Number((baseLng + shift).toFixed(5))
  });
  res.json({
    hospitals: [mk("City General Hospital", "hospital", 0.01), mk("Metro Emergency Care", "hospital", -0.012)],
    policeStations: [mk("Central Police Station", "police", 0.008), mk("North Police Unit", "police", -0.009)],
    fireStations: [mk("Main Fire Station", "fire", 0.006), mk("Rapid Fire Unit", "fire", -0.007)]
  });
}
