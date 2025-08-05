import { format, parseISO } from 'date-fns';
import { enUS, fr, pt } from 'date-fns/locale';
import i18n from '../i18n';

/**
 * Get the appropriate date-fns locale based on the current i18n language
 */
const getLocale = () => {
  const lang = i18n.language;

  switch (lang) {
    case 'fr':
      return fr;
    case 'pt':
      return pt;
    case 'en':
    default:
      return enUS;
  }
};

/**
 * Format a date string or Date object according to the current locale
 *
 * @param date Date string or Date object to format
 * @param formatStr The format string to use (date-fns format)
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  formatStr: string
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: getLocale() });
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof date === 'string' ? date : date.toString();
  }
};

/**
 * Format a date string or Date object showing only the date part
 *
 * @param date Date string or Date object to format
 * @param formatStr Optional custom format string
 * @returns Formatted date string
 */
export const formatDateOnly = (
  date: string | Date,
  formatStr = 'PPP' // 'PPP' gives "April 29th, 2023" in English
): string => {
  return formatDate(date, formatStr);
};

/**
 * Format a date string or Date object showing only the time part
 *
 * @param date Date string or Date object to format
 * @param formatStr Optional custom format string
 * @returns Formatted time string
 */
export const formatTimeOnly = (
  date: string | Date,
  formatStr = 'p' // 'p' gives "12:00 AM/PM" format
): string => {
  return formatDate(date, formatStr);
};

/**
 * Format a date string or Date object showing both date and time
 *
 * @param date Date string or Date object to format
 * @param formatStr Optional custom format string
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: string | Date,
  formatStr = 'PPp' // 'PPp' gives "Apr 29, 2023, 12:00 AM/PM" format
): string => {
  return formatDate(date, formatStr);
};
