/**
 * Utility functions for date calculations
 */
/**
 * Calculate age from birth date
 * @param tanggalLahir - Birth date
 * @param referenceDate - Reference date (default: today)
 * @returns Age in years
 */
export declare const calculateAge: (tanggalLahir: Date | string, referenceDate?: Date) => number;
/**
 * Format date to Indonesian locale string
 * @param date - Date to format
 * @returns Formatted date string
 */
export declare const formatDateIndonesian: (date: Date | string) => string;
/**
 * Calculate age in months for children under 5 years
 * @param tanggalLahir - Birth date
 * @param referenceDate - Reference date (default: today)
 * @returns Age in months
 */
export declare const calculateAgeInMonths: (tanggalLahir: Date | string, referenceDate?: Date) => number;
//# sourceMappingURL=dateUtils.d.ts.map