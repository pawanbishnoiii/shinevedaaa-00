import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CurrencyData {
  USD: number;
  INR: number;
}

interface ExchangeRateResponse {
  rates: {
    INR: number;
  };
}

const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR'>('USD');

  // Fetch live exchange rates
  const { data: exchangeData, isLoading } = useQuery<ExchangeRateResponse>({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      // Using a free exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  const convertPrice = (priceString: string, fromCurrency: 'USD' | 'INR' = 'USD') => {
    if (!exchangeData || isLoading) {
      return {
        USD: priceString,
        INR: priceString,
        rate: 1
      };
    }

    // Extract numeric value from price string
    const numericValue = parseFloat(priceString.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue)) {
      return {
        USD: priceString,
        INR: priceString,
        rate: exchangeData.rates.INR
      };
    }

    const usdToInrRate = exchangeData.rates.INR;

    let usdValue: number;
    let inrValue: number;

    if (fromCurrency === 'USD') {
      usdValue = numericValue;
      inrValue = numericValue * usdToInrRate;
    } else {
      usdValue = numericValue / usdToInrRate;
      inrValue = numericValue;
    }

    return {
      USD: `$${usdValue.toFixed(2)}`,
      INR: `₹${inrValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      rate: usdToInrRate
    };
  };

  const formatPrice = (priceString: string, currency: 'USD' | 'INR' = selectedCurrency) => {
    const converted = convertPrice(priceString);
    return converted[currency];
  };

  const toggleCurrency = () => {
    setSelectedCurrency(prev => prev === 'USD' ? 'INR' : 'USD');
  };

  return {
    selectedCurrency,
    setSelectedCurrency,
    toggleCurrency,
    convertPrice,
    formatPrice,
    exchangeRate: exchangeData?.rates.INR || 83.5, // fallback rate
    isLoading
  };
};

export default useCurrency;