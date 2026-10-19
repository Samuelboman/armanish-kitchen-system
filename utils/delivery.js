const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

// Straight-line distance between two points on the earth (the haversine formula)
export const straightLineKm = (lat1, lng1, lat2, lng2) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export const quoteDelivery = (settings, lat, lng) => {
  const roadKm = straightLineKm(settings.kitchenLat, settings.kitchenLng, lat, lng) * settings.roadFactor;
  const distanceKm = Math.round(roadKm * 10) / 10;
  if (roadKm > settings.maxDistanceKm) return { deliverable: false, distanceKm };

  const raw = Math.max(settings.minFee, settings.baseFee + settings.perKmRate * roadKm);
  const fee = Math.ceil(raw / settings.roundTo) * settings.roundTo;
  return { deliverable: true, distanceKm, fee };
};