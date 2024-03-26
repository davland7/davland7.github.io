/**
 * Format a number to a currency string
 * @param value - The number to format
 * @param locale - The locale to use
 * @param currency - The currency to use
 * @param digits - The number of digits to display after the decimal point
 * @returns The formatted currency string
 * @example
 * formatCurrency(10000, 'en-US', 'USD') // $10,000.00
 * formatCurrency(10000, 'en-US', 'USD', 1) // $10,000
 * formatCurrency(10000, 'fr-FR', 'EUR') // 10 000,00 €
 * formatCurrency(10000, 'fr-FR', 'EUR', 1) // 10 000 €
 */
export const formatCurrency = (
  value: number,
  locale: string,
  currency: string,
  digits: number = 2
):string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    useGrouping: true,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
};
