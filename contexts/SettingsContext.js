// File: SettingsContext.js
// Path: /FITDJ/contexts/SettingsContext.js

import React, { createContext } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  return (
    <SettingsContext.Provider value={{}}>
      {children}
    </SettingsContext.Provider>
  );
};