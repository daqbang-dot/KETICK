import React, { useContext, useEffect, useState } from 'react';
import { KetickContext } from '../../context/KetickContext';

const POSSystem = () => {
  // Menarik data dari context (Global State)
  const { companyProfile, inventory, clients } = useContext(KetickContext);
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // Fungsi Tambah ke Troli
  const addToCart = (product) => {
    if (product.stock_level > 0) {
      setCart([...cart, { ...product, qty: 1 }]);
    } else {
      alert("Stok Habis!");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-4">
      {/* Bahagian Produk (POS) */}
      <div className="col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Produk & Perkhidmatan</h2>
        <div className="grid grid-cols-3 gap-4">
          {inventory.map((item) => (
            <button 
              key={item.id}
              onClick={() => addToCart(item)}
              className="p-4 border dark:border-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-blue-500">RM {item.price}</p>
              <p className="text-xs text-slate-400">Stok: {item.stock_level}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bahagian Bil (Checkout) */}
      <div className="col-span-4 bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border-l dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Checkout Bil</h2>
        
        {/* INFO SYARIKAT (Autosync dari Profile) */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-slate-800 rounded-lg text-xs">
          <p className="font-bold">{companyProfile.name || "Sila Isi Profil Syarikat"}</p>
          <p>{companyProfile.address}</p>
        </div>

        {/* SENARAI ITEM DALAM BIL */}
        <div className="space-y-3">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name} x1</span>
              <span>RM {item.price}</span>
            </div>
          ))}
        </div>

        <hr className="my-4 dark:border-slate-800" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>RM {cart.reduce((acc, curr) => acc + curr.price, 0)}</span>
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
          PROSES PEMBAYARAN
        </button>
      </div>
    </div>
  );
};

export default POSSystem;
