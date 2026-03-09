import React, { useContext } from 'react';
import { KetickContext } from '../../context/KetickContext';

const FinancingPortal = () => {
  const { salesData } = useContext(KetickContext);
  const totalSales = salesData?.reduce((acc, curr) => acc + curr.total, 0) || 0;
  const creditLimit = totalSales * 0.4; // Kelayakan 40% dari jualan

  return (
    <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-3xl shadow-2xl">
      <h2 className="text-xl font-black uppercase tracking-widest italic">KETICK Financing</h2>
      <div className="mt-8">
        <p className="text-sm opacity-80 uppercase font-bold">Kelayakan Pembiayaan Anda</p>
        <h1 className="text-5xl font-black mt-2">RM {creditLimit.toLocaleString()}</h1>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <button className="bg-white text-blue-900 p-4 rounded-xl font-bold hover:scale-105 transition">Minta Dana</button>
        <button className="bg-blue-500/30 border border-white/20 p-4 rounded-xl font-bold">Rekod Bayaran</button>
      </div>
    </div>
  );
};

export default FinancingPortal;
