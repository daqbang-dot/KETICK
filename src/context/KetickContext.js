import React, { createContext, useState } from 'react';

export const KetickContext = createContext();

export const KetickProvider = ({ children }) => {
  // Data dikongsi antara semua modul
  const [companyProfile, setCompanyProfile] = useState({});
  const [inventory, setInventory] = useState([]);
  const [clients, setClients] = useState([]);

  return (
    <KetickContext.Provider value={{ 
      companyProfile, setCompanyProfile, 
      inventory, setInventory, 
      clients, setClients 
    }}>
      {children}
    </KetickContext.Provider>
  );
};
