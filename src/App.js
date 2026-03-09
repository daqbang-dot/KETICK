import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KetickProvider } from './context/KetickContext';
import Layout from './components/Layout';

// IMPORT MODUL DARI SUBFOLDER (Modular)
import Dashboard from './modules/Dashboard/Main';
import Financing from './modules/Financing/Portal';
import Sales from './modules/Sales/POSSystem';
import Purchase from './modules/Purchase/Orders';
import DigitalShoes from './modules/DigitalShoes/Catalog';
import Bank from './modules/Bank/Reconciliation';
import Contact from './modules/Contact/CRM';
import Products from './modules/Products/Manager';
import Stock from './modules/Stock/InventoryManager';
import MyInvoice from './modules/MyInvoice/InvoiceTemplate';
import Report from './modules/Report/Analytics';
import Accounting from './modules/Accounting/Ledger';
import Flow from './modules/Flow/Automation';
import Backup from './modules/Backup/DataControl';

function App() {
  return (
    <KetickProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Setiap fungsi diletakkan dalam route yang berbeza */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/digital-shoes" element={<DigitalShoes />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/myinvoice" element={<MyInvoice />} />
            <Route path="/report" element={<Report />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/flow" element={<Flow />} />
            <Route path="/backup" element={<Backup />} />
          </Routes>
        </Layout>
      </Router>
    </KetickProvider>
  );
}

export default App;
