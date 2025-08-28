import React, { useState } from 'react';
import useCurrency from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, IndianRupee, Loader2 } from 'lucide-react';

interface CurrencyPriceProps {
  priceRange?: string;
  className?: string;
}

const CurrencyPrice: React.FC<CurrencyPriceProps> = ({ priceRange, className = '' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR'>('USD');
  const { exchangeRate, isLoading } = useCurrency();

  if (!priceRange) {
    return (
      <div className={className}>
        <p className="text-lg font-semibold text-muted-foreground">Contact for pricing</p>
      </div>
    );
  }

  // Extract numeric values from price range (e.g., "$500-800/ton" -> [500, 800])
  const extractPrices = (range: string): { min: number; max: number; unit: string } => {
    const match = range.match(/\$?(\d+)-?(\d+)?.*?(\/\w+)?/);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[2] ? parseInt(match[2]) : min;
      const unit = match[3] || '/unit';
      return { min, max, unit };
    }
    return { min: 0, max: 0, unit: '/unit' };
  };

  const { min, max, unit } = extractPrices(priceRange);

  const formatPrice = (amount: number, currency: 'USD' | 'INR') => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`;
    } else {
      const convertedAmount = amount * exchangeRate;
      return `₹${convertedAmount.toLocaleString()}`;
    }
  };

  const displayRange = () => {
    if (min === max) {
      return `${formatPrice(min, selectedCurrency)}${unit}`;
    }
    return `${formatPrice(min, selectedCurrency)} - ${formatPrice(max, selectedCurrency)}${unit}`;
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Currency Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedCurrency === 'USD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCurrency('USD')}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-3 w-3" />
            USD
          </Button>
          <Button
            variant={selectedCurrency === 'INR' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCurrency('INR')}
            className="flex items-center gap-2"
          >
            <IndianRupee className="h-3 w-3" />
            INR
          </Button>
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
        </div>

        {/* Price Display */}
        <div>
          <p className="text-2xl font-bold text-primary">{displayRange()}</p>
          {selectedCurrency === 'INR' && (
            <p className="text-xs text-muted-foreground">
              * Converted from USD at live exchange rate
            </p>
          )}
        </div>

        {/* Exchange Rate Info */}
        {selectedCurrency === 'INR' && (
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Rate:</span>
                <Badge variant="outline">
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    `1 USD = ₹${exchangeRate.toFixed(2)}`
                  )}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Live rates updated every hour
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CurrencyPrice;