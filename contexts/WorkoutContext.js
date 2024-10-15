// File: WorkoutContext.js
// Path: /FITDJ/contexts/WorkoutContext.js

import React, { createContext } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  return (
    <WorkoutContext.Provider value={{}}>
      {children}
    </WorkoutContext.Provider>
  );
};