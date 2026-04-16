import moment from "moment-hijri";

// Initialize locale to ensure consistent formatting
moment.locale("en");

/**
 * Formats a Gregorian date into a Hijri string (iYYYY-iMM-iDD)
 */
export const formatHijri = (date: Date | string | null | undefined): string => {
  if (!date) return "-";
  const m = moment(date);
  if (!m.isValid()) return "-";
  return m.format("iYYYY-iMM-iDD");
};

/**
 * Formats a Gregorian date into a standard string (DD-MM-YYYY)
 */
export const formatGregorian = (date: Date | string | null | undefined): string => {
  if (!date) return "-";
  const m = moment(date);
  if (!m.isValid()) return "-";
  return m.format("DD-MM-YYYY");
};

/**
 * Parsers a string into a Date object based on the mode.
 * Supports both Hijri (iDD/iMM/iYYYY or iYYYY/iMM/iDD) and standard Gregorian strings.
 */
export const parseDualDate = (val: string | null | undefined, mode: "HIJRI" | "GREGORIAN"): Date | null => {
  if (!val || typeof val !== "string") return null;
  
  const cleanVal = val.trim().replace(/-/g, "/");
  
  if (mode === "HIJRI") {
    // Try standard formats
    const m1 = moment(cleanVal, "iDD/iMM/iYYYY");
    if (m1.isValid()) return m1.toDate();
    
    const m2 = moment(cleanVal, "iYYYY/iMM/iDD");
    if (m2.isValid()) return m2.toDate();
    
    return null;
  }
  
  // Standard Gregorian parsing
  const d = new Date(cleanVal);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Returns a dual-calendar string for display (Gregorian / Hijri)
 */
export const formatDualCalendar = (date: Date | string | null | undefined): string => {
  if (!date) return "-";
  return `${formatGregorian(date)} / ${formatHijri(date)}`;
};
