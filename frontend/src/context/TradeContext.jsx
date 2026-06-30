import React, { createContext, useState, useContext, useCallback } from 'react';

const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [portfolioRefreshTick, setPortfolioRefreshTick] = useState(0);

  // Call after a trade to trigger portfolio re-fetches
  const triggerPortfolioRefresh = useCallback(() => {
    setPortfolioRefreshTick(t => t + 1);
  }, []);

  return (
    <TradeContext.Provider value={{ portfolioRefreshTick, triggerPortfolioRefresh }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => useContext(TradeContext);
