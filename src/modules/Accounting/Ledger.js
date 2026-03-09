import React from 'react';

const Accounting = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-900">
        <p className="text-sm font-bold text-green-600">Untung Bersih (P&L)</p>
        <h2 className="text-3xl font-black text-green-700">+ RM 12,450.00</h2>
      </div>
      <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900">
        <p className="text-sm font-bold text-red-600">Perbelanjaan (Expenses)</p>
        <h2 className="text-3xl font-black text-red-700">- RM 3,120.00</h2>
      </div>
      {/* Ledger Table di sini */}
    </div>
  );
};

export default Accounting;
