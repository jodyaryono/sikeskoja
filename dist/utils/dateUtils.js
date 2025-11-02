"use strict";
/**
 * Utility functions for date calculations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAgeInMonths = exports.formatDateIndonesian = exports.calculateAge = void 0;
/**
 * Calculate age from birth date
 * @param tanggalLahir - Birth date
 * @param referenceDate - Reference date (default: today)
 * @returns Age in years
 */
var calculateAge = function (tanggalLahir, referenceDate) {
    if (referenceDate === void 0) { referenceDate = new Date(); }
    var birthDate = typeof tanggalLahir === "string" ? new Date(tanggalLahir) : tanggalLahir;
    var refDate = typeof referenceDate === "string" ? new Date(referenceDate) : referenceDate;
    var age = refDate.getFullYear() - birthDate.getFullYear();
    var monthDiff = refDate.getMonth() - birthDate.getMonth();
    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 ||
        (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
exports.calculateAge = calculateAge;
/**
 * Format date to Indonesian locale string
 * @param date - Date to format
 * @returns Formatted date string
 */
var formatDateIndonesian = function (date) {
    var d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};
exports.formatDateIndonesian = formatDateIndonesian;
/**
 * Calculate age in months for children under 5 years
 * @param tanggalLahir - Birth date
 * @param referenceDate - Reference date (default: today)
 * @returns Age in months
 */
var calculateAgeInMonths = function (tanggalLahir, referenceDate) {
    if (referenceDate === void 0) { referenceDate = new Date(); }
    var birthDate = typeof tanggalLahir === "string" ? new Date(tanggalLahir) : tanggalLahir;
    var refDate = typeof referenceDate === "string" ? new Date(referenceDate) : referenceDate;
    var yearDiff = refDate.getFullYear() - birthDate.getFullYear();
    var monthDiff = refDate.getMonth() - birthDate.getMonth();
    return yearDiff * 12 + monthDiff;
};
exports.calculateAgeInMonths = calculateAgeInMonths;
