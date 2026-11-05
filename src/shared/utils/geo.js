// Distância em linha reta entre dois pontos, pela fórmula de haversine · função pura
const RAIO_DA_TERRA_KM = 6371;
const emRadianos = (graus) => (graus * Math.PI) / 180;

/** Em km, com uma casa decimal. Nula se faltar alguma coordenada. */
export const distanceKm = (a, b) => {
  if (a?.latitude == null || a?.longitude == null || b?.latitude == null || b?.longitude == null) return null;
  const dLat = emRadianos(b.latitude - a.latitude);
  const dLon = emRadianos(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(emRadianos(a.latitude)) * Math.cos(emRadianos(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * RAIO_DA_TERRA_KM * Math.asin(Math.sqrt(h)) * 10) / 10;
};
