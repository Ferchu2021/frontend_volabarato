// Utilidad para conversión de monedas

export type Currency = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'MXN' | 'COP' | 'CLP' | 'PEN';

// Tasas de cambio (aproximadas, deberían venir de una API en producción)
const EXCHANGE_RATES: Record<Currency, number> = {
  ARS: 1,      // Base
  USD: 1000,   // 1 USD = ~1000 ARS
  EUR: 1100,   // 1 EUR = ~1100 ARS
  BRL: 200,    // 1 BRL = ~200 ARS
  MXN: 50,     // 1 MXN = ~50 ARS
  COP: 0.25,   // 1 COP = ~0.25 ARS
  CLP: 1,      // 1 CLP = ~1 ARS
  PEN: 250     // 1 PEN = ~250 ARS
};

/**
 * Convierte una cantidad de una moneda a otra
 */
export const convertCurrency = (amount: number, from: Currency | string, to: Currency | string): number => {
  if (from === to) return amount;
  
  // Validar que las monedas estén en el registro
  const fromRate = EXCHANGE_RATES[from as Currency] || 1;
  const toRate = EXCHANGE_RATES[to as Currency] || 1;
  
  // Convertir a ARS primero
  const amountInARS = amount * fromRate;
  
  // Convertir a la moneda destino
  return amountInARS / toRate;
};

/**
 * Formatea una cantidad según la moneda
 */
export const formatCurrency = (amount: number, currency: Currency | string = 'ARS'): string => {
  const localeMap: Record<string, string> = {
    ARS: 'es-AR',
    USD: 'en-US',
    EUR: 'de-DE',
    BRL: 'pt-BR',
    MXN: 'es-MX',
    COP: 'es-CO',
    CLP: 'es-CL',
    PEN: 'es-PE'
  };

  const currencyCode = (currency as string).toUpperCase();
  const locale = localeMap[currencyCode] || 'es-AR';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'ARS' || currencyCode === 'CLP' || currencyCode === 'COP' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'ARS' || currencyCode === 'CLP' || currencyCode === 'COP' ? 0 : 2
    }).format(amount);
  } catch (error) {
    // Fallback si hay error
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
};

/**
 * Obtiene el símbolo de la moneda
 */
export const getCurrencySymbol = (currency: Currency | string): string => {
  const symbols: Record<string, string> = {
    ARS: '$',
    USD: 'US$',
    EUR: '€',
    BRL: 'R$',
    MXN: '$',
    COP: '$',
    CLP: '$',
    PEN: 'S/'
  };
  return symbols[(currency as string).toUpperCase()] || '$';
};

/**
 * Obtiene el nombre completo de la moneda
 */
export const getCurrencyName = (currency: Currency | string): string => {
  const names: Record<string, string> = {
    ARS: 'Peso Argentino',
    USD: 'Dólar Estadounidense',
    EUR: 'Euro',
    BRL: 'Real Brasileño',
    MXN: 'Peso Mexicano',
    COP: 'Peso Colombiano',
    CLP: 'Peso Chileno',
    PEN: 'Sol Peruano'
  };
  return names[(currency as string).toUpperCase()] || currency as string;
};

/**
 * Opciones de moneda para selectores
 */
export const CURRENCY_OPTIONS: Array<{ value: Currency; label: string; symbol: string }> = [
  { value: 'ARS', label: 'Peso Argentino', symbol: '$' },
  { value: 'USD', label: 'Dólar Estadounidense', symbol: 'US$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'BRL', label: 'Real Brasileño', symbol: 'R$' },
  { value: 'MXN', label: 'Peso Mexicano', symbol: '$' },
  { value: 'COP', label: 'Peso Colombiano', symbol: '$' },
  { value: 'CLP', label: 'Peso Chileno', symbol: '$' },
  { value: 'PEN', label: 'Sol Peruano', symbol: 'S/' }
];

