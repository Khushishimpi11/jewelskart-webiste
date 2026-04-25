import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ExchangeProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  sku?: string;
}

export interface ExchangeData {
  orderId: string;
  returnProductId: string;
  returnProductName: string;
  returnProductPrice: number;
  returnProductImage: string;
  returnReason: string;
  returnDescription: string;
  uploadedImages: string[];
  acceptedTerms: boolean;
  acceptedCondition: boolean;
  selectedExchangeProduct: ExchangeProduct | null;
  step: 'init' | 'selecting' | 'complete';
  timestamp: number;
}

interface ExchangeContextType {
  exchangeData: ExchangeData | null;
  setExchangeData: (data: ExchangeData | null) => void;
  clearExchangeData: () => void;
  isExchangeMode: boolean;
  setIsExchangeMode: (value: boolean) => void;
  updateSelectedProduct: (product: ExchangeProduct) => void;
  updateFormData: (data: Partial<ExchangeData>) => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within ExchangeProvider');
  }
  return context;
};

export const ExchangeProvider = ({ children }: { children: ReactNode }) => {
  const [exchangeData, setExchangeData] = useState<ExchangeData | null>(null);
  const [isExchangeMode, setIsExchangeMode] = useState(false);

  // Load from localStorage on mount (persists across page refresh)
  useEffect(() => {
    const saved = localStorage.getItem('exchange_context_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Check if data is not too old (within 30 minutes)
        if (Date.now() - (data.timestamp || 0) < 30 * 60 * 1000) {
          setExchangeData(data);
          if (data.step === 'selecting') {
            setIsExchangeMode(true);
          }
        } else {
          localStorage.removeItem('exchange_context_data');
        }
      } catch (e) {
        console.error('Error loading exchange data:', e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (exchangeData) {
      localStorage.setItem('exchange_context_data', JSON.stringify(exchangeData));
    } else {
      localStorage.removeItem('exchange_context_data');
    }
  }, [exchangeData]);

  const clearExchangeData = () => {
    setExchangeData(null);
    setIsExchangeMode(false);
    localStorage.removeItem('exchange_context_data');
  };

  const updateSelectedProduct = (product: ExchangeProduct) => {
    if (exchangeData) {
      const priceDiff = product.price - exchangeData.returnProductPrice;
      setExchangeData({
        ...exchangeData,
        selectedExchangeProduct: product,
        step: 'complete',
        timestamp: Date.now()
      });
    }
  };

  const updateFormData = (data: Partial<ExchangeData>) => {
    if (exchangeData) {
      setExchangeData({
        ...exchangeData,
        ...data,
        timestamp: Date.now()
      });
    }
  };

  return (
    <ExchangeContext.Provider
      value={{
        exchangeData,
        setExchangeData,
        clearExchangeData,
        isExchangeMode,
        setIsExchangeMode,
        updateSelectedProduct,
        updateFormData,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};