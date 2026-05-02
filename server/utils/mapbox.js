export async function getDirections({ startLng, startLat, endLng, endLat }) {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) return null;
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}` +
    `?geometries=geojson&overview=full&access_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  const route = data?.routes?.[0];
  if (!route) return null;
  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    etaMinutes: Math.max(1, Math.round(route.duration / 60)),
    coordinates: route.geometry?.coordinates || []
  };
}
