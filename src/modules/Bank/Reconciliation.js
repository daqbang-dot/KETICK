import React from 'react';

const Bank = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Pengurusan Bank</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Sambung Bank API</button>
      </div>
      <div className="space-y-4">
        {[ {name: 'Maybank', acc: '1234...5678', bal: 45000.50}, {name: 'CIMB', acc: '8888...9900', bal: 1240.00} ].map((b, i) => (
          <div key={i} className="flex justify-between p-4 border dark:border-slate-800 rounded-xl">
            <div>
              <p className="font-bold">{b.name}</p>
              <p className="text-xs text-slate-500">{b.acc}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-blue-600">RM {b.bal.toLocaleString()}</p>
              <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-blue-500">Rekonsiliasi</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bank;
