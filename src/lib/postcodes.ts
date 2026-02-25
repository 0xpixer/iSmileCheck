/**
 * Sample postcode → area name for Singapore (6-digit) and Indonesia (5-digit).
 * Used for form dropdown; no database integration.
 */

export type CountryCode = "SG" | "ID";

export const POSTCODE_AREAS: { country: CountryCode; postcode: string; areaName: string }[] = [
  // Singapore (6-digit)
  { country: "SG", postcode: "018956", areaName: "Marina Bay" },
  { country: "SG", postcode: "018956", areaName: "Raffles Place" },
  { country: "SG", postcode: "079909", areaName: "Orchard" },
  { country: "SG", postcode: "238858", areaName: "Orchard Road" },
  { country: "SG", postcode: "088328", areaName: "Tanjong Pagar" },
  { country: "SG", postcode: "149954", areaName: "Queenstown" },
  { country: "SG", postcode: "149954", areaName: "Tiong Bahru" },
  { country: "SG", postcode: "098585", areaName: "HarbourFront" },
  { country: "SG", postcode: "119275", areaName: "Clementi" },
  { country: "SG", postcode: "199637", areaName: "Little India" },
  { country: "SG", postcode: "427990", areaName: "Katong" },
  { country: "SG", postcode: "428796", areaName: "Joo Chiat" },
  { country: "SG", postcode: "460221", areaName: "Bedok" },
  { country: "SG", postcode: "529509", areaName: "Tampines" },
  { country: "SG", postcode: "518457", areaName: "Pasir Ris" },
  { country: "SG", postcode: "609606", areaName: "Jurong East" },
  { country: "SG", postcode: "689673", areaName: "Choa Chu Kang" },
  { country: "SG", postcode: "768923", areaName: "Yishun" },
  { country: "SG", postcode: "738078", areaName: "Sembawang" },
  { country: "SG", postcode: "558508", areaName: "Loyang" },
  { country: "SG", postcode: "509766", areaName: "Changi" },
  // Indonesia (5-digit)
  { country: "ID", postcode: "10110", areaName: "Jakarta Pusat" },
  { country: "ID", postcode: "10120", areaName: "Gambir" },
  { country: "ID", postcode: "10130", areaName: "Cikini" },
  { country: "ID", postcode: "10210", areaName: "Jakarta Utara" },
  { country: "ID", postcode: "10220", areaName: "Tanjung Priok" },
  { country: "ID", postcode: "10230", areaName: "Pademangan" },
  { country: "ID", postcode: "10310", areaName: "Jakarta Barat" },
  { country: "ID", postcode: "10320", areaName: "Kebon Jeruk" },
  { country: "ID", postcode: "10330", areaName: "Palmerah" },
  { country: "ID", postcode: "10410", areaName: "Jakarta Selatan" },
  { country: "ID", postcode: "10420", areaName: "Kebayoran Baru" },
  { country: "ID", postcode: "10430", areaName: "Cilandak" },
  { country: "ID", postcode: "10510", areaName: "Jakarta Timur" },
  { country: "ID", postcode: "10520", areaName: "Jatinegara" },
  { country: "ID", postcode: "10530", areaName: "Duren Sawit" },
  { country: "ID", postcode: "40111", areaName: "Bandung" },
  { country: "ID", postcode: "60271", areaName: "Surabaya Pusat" },
  { country: "ID", postcode: "80234", areaName: "Denpasar" },
];

export function getAreasForPostcode(
  country: CountryCode,
  postcodeInput: string
): { postcode: string; areaName: string }[] {
  const normalized = postcodeInput.replace(/\D/g, "").trim();
  if (!normalized) return [];
  const list = POSTCODE_AREAS.filter(
    (a) => a.country === country && a.postcode.startsWith(normalized)
  );
  const seen = new Set<string>();
  return list.filter((a) => {
    const key = `${a.postcode}|${a.areaName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
