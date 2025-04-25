/**
 * Converts Argentine Pesos (ARS) to US Dollars (USD)
 */
export const convertARStoUSD = (amount: number, dollarRate: number): number => {
  if (!dollarRate) return 0;
  return amount / dollarRate;
};

/**
 * Formats currency for display with appropriate symbol and decimal places
 */
export const formatCurrency = (
  amount: number,
  currency: 'ARS' | 'USD' = 'ARS',
  minimumFractionDigits = 2
): string => {
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency === 'ARS' ? 'ARS' : 'USD',
    minimumFractionDigits,
  });
  
  return formatter.format(amount);
};