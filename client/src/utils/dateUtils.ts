/**
 * Utility functions for date calculations
 */

/**
 * Calculate age from birth date
 * @param tanggalLahir - Birth date (Date object or string)
 * @param referenceDate - Reference date (default: today)
 * @returns Age in years
 */
export const calculateAge = (
  tanggalLahir: Date | string,
  referenceDate: Date = new Date()
): number => {
  const birthDate =
    typeof tanggalLahir === "string" ? new Date(tanggalLahir) : tanggalLahir;
  const refDate =
    typeof referenceDate === "string" ? new Date(referenceDate) : referenceDate;

  let age = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && refDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Format date to Indonesian locale string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateIndonesian = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format date for input[type="date"]
 * @param date - Date to format
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Calculate age in months for children under 5 years
 * @param tanggalLahir - Birth date
 * @param referenceDate - Reference date (default: today)
 * @returns Age in months
 */
export const calculateAgeInMonths = (
  tanggalLahir: Date | string,
  referenceDate: Date = new Date()
): number => {
  const birthDate =
    typeof tanggalLahir === "string" ? new Date(tanggalLahir) : tanggalLahir;
  const refDate =
    typeof referenceDate === "string" ? new Date(referenceDate) : referenceDate;

  const yearDiff = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();

  return yearDiff * 12 + monthDiff;
};

/**
 * Get age display string (years or months for young children)
 * @param tanggalLahir - Birth date
 * @returns Formatted age string (e.g., "25 tahun", "6 bulan")
 */
export const getAgeDisplay = (tanggalLahir: Date | string): string => {
  const ageInYears = calculateAge(tanggalLahir);

  if (ageInYears < 2) {
    const ageInMonths = calculateAgeInMonths(tanggalLahir);
    return `${ageInMonths} bulan`;
  }

  return `${ageInYears} tahun`;
};
