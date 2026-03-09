import React from 'react';

const DigitalShoes = () => {
  const shoes = [
    { id: 1, name: "Ketick Air Pro", price: 450, img: "shoes1.jpg" },
    { id: 2, name: "Ketick Stealth", price: 320, img: "shoes2.jpg" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {shoes.map(shoe => (
        <div key={shoe.id} className="group relative bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 hover:shadow-2xl transition-all">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-4">
             {/* Simbolik Imej */}
             <div className="w-full h-full flex items-center justify-center text-slate-400">3D View</div>
          </div>
          <h3 className="font-bold text-lg">{shoe.name}</h3>
          <p className="text-blue-600 font-black">RM {shoe.price}</p>
          <button className="mt-4 w-full bg-slate-900 dark:bg-blue-600 text-white py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Add to Catalog
          </button>
        </div>
      ))}
    </div>
  );
};

export default DigitalShoes;
