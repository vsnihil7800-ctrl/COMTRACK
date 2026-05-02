const ROUTING_MAP = {
  garbage: "Municipality",
  street_light: "Electricity Board",
  water_leakage: "Water Department",
  sewage: "Water Department",
  road_damage: "Road Maintenance",
  pothole: "Road Maintenance",
  electricity: "Electricity Board",
  public_safety: "Public Safety Department"
};

export function classifyComplaint(text = "") {
  const content = text.toLowerCase();
  if (content.includes("garbage")) return "garbage";
  if (content.includes("light") || content.includes("electric")) return "street_light";
  if (content.includes("water") || content.includes("leak")) return "water_leakage";
  if (content.includes("sewage")) return "sewage";
  if (content.includes("road")) return "road_damage";
  if (content.includes("pothole")) return "pothole";
  if (content.includes("crime") || content.includes("unsafe")) return "public_safety";
  return "public_safety";
}

export function detectPriority(text = "") {
  const content = text.toLowerCase();
  if (content.includes("urgent") || content.includes("immediately") || content.includes("danger")) return "high";
  if (content.includes("critical") || content.includes("death")) return "critical";
  return "medium";
}

export function mapDepartment(category) {
  return ROUTING_MAP[category] || "Public Support";
}

export function suggestETA(distanceKm = 5) {
  return Math.max(2, Math.round(distanceKm * 4));
}
