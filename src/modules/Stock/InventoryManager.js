import React, { useContext, useState } from 'react';
import { KetickContext } from '../../context/KetickContext';

const InventoryManager = () => {
  const { inventory, setInventory } = useContext(KetickContext);
  const [newItem, setNewItem] = useState({ name: '', price: 0, stock_level: 0 });

  const addStock = () => {
    setInventory([...inventory, { ...newItem, id: Date.now() }]);
    setNewItem({ name: '', price: 0, stock_level: 0 });
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-black text-blue-600 uppercase italic">Stock & Inventory</h2>
      
      {/* Borang Tambah Stok Premium */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
        <input 
          placeholder="Nama Produk" 
          className="bg-transparent border-b-2 border-slate-300 dark:border-slate-700 p-2 focus:border-blue-500 outline-none"
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
        />
        <input 
          type="number" placeholder="Harga (RM)" 
          className="bg-transparent border-b-2 border-slate-300 dark:border-slate-700 p-2 focus:border-blue-500 outline-none"
          onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
        />
        <button onClick={addStock} className="bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
          TAMBAH ITEM
        </button>
      </div>

      {/* Senarai Inventory dengan Low Stock Alert */}
      <div className="overflow-hidden rounded-xl border dark:border-slate-800">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4 text-right">Kuantiti</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {inventory.map((item) => (
              <tr key={item.id} className="border-b dark:border-slate-800">
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="p-4 text-right">{item.stock_level} Unit</td>
                <td className="p-4 text-right">
                  {item.stock_level <= 5 ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-[10px] font-black animate-pulse">STOK RENDAH</span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-[10px] font-black tracking-tighter">STABIL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;
