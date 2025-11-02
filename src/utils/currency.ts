// Utilidad para conversión de monedas

export type Currency = 'ARS' | 'USD' | 'EUR' | 'BRL';

// Tasas de cambio (aproximadas, deberían venir de una API en producción)
const EXCHANGE_RATES: Record<Currency, number> = {
  ARS: 1,      // Base
  USD: 1000,   // 1 USD = ~1000 ARS
  EUR: 1100,   // 1 EUR = ~1100 ARS
  BRL: 200     // 1 BRL = ~200 ARS
};

/**
 * Convierte una cantidad en ARS a otra moneda
 */
export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) return amount;
  
  // Convertir a ARS primero
  const amountInARS = amount * EXCHANGE_RATES[from];
  
  // Convertir a la moneda destino
  return amountInARS / EXCHANGE_RATES[to];
};

/**
 * Formatea una cantidad según la moneda
 */
export const formatCurrency = (amount: number, currency: Currency = 'ARS'): string => {
  const localeMap: Record<Currency, string> = {
    ARS: 'es-AR',
    USD: 'en-US',
    EUR: 'de-DE',
    BRL: 'pt-BR'
  };

  const currencySymbolMap: Record<Currency, string> = {
    ARS: 'ARS',
    USD: 'USD',
    EUR: 'EUR',
    BRL: 'BRL'
  };

  try {
    return new Intl.NumberFormat(localeMap[currency], {
      style: 'currency',
      currency: currencySymbolMap[currency],
      minimumFractionDigits: currency === 'ARS' ? 0 : 2,
      maximumFractionDigits: currency === 'ARS' ? 0 : 2
    }).format(amount);
  } catch (error) {
    // Fallback si hay error
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/**
 * Obtiene el símbolo de la moneda
 */
export const getCurrencySymbol = (currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    ARS: '$',
    USD: 'US$',
    EUR: '€',
    BRL: 'R$'
  };
  return symbols[currency];
};

/**
 * Obtiene el nombre completo de la moneda
 */
export const getCurrencyName = (currency: Currency): string => {
  const names: Record<Currency, string> = {
    ARS: 'Peso Argentino',
    USD: 'Dólar Estadounidense',
    EUR: 'Euro',
    BRL: 'Real Brasileño'
  };
  return names[currency];
};

/**
 * Opciones de moneda para selectores
 */
export const CURRENCY_OPTIONS: Array<{ value: Currency; label: string; symbol: string }> = [
  { value: 'ARS', label: 'Peso Argentino', symbol: '$' },
  { value: 'USD', label: 'Dólar Estadounidense', symbol: 'US$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'BRL', label: 'Real Brasileño', symbol: 'R$' }
];

