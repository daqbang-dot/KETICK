import React, { useContext } from 'react';
import { KetickContext } from '../../context/KetickContext';

const InvoiceTemplate = ({ invoiceData }) => {
  const { companyProfile } = useContext(KetickContext);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl transition-colors duration-300">
      {/* Header: Maklumat Syarikat (Auto-sync) */}
      <div className="flex justify-between items-start border-b dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter uppercase italic">KETICK</h1>
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            <p className="font-bold text-slate-900 dark:text-white">{companyProfile.name}</p>
            <p>{companyProfile.address}</p>
            <p>No. Pendaftaran: {companyProfile.reg_no}</p>
            <p>Tel: {companyProfile.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-400">INVOICE</h2>
          <p className="text-sm font-mono mt-2">#{invoiceData.id}</p>
          <p className="text-xs text-slate-500 mt-1">Tarikh: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Maklumat Klien */}
      <div className="my-8">
        <p className="text-xs font-bold text-blue-500 uppercase mb-2">Bil Kepada:</p>
        <p className="font-semibold text-lg">{invoiceData.clientName}</p>
        <p className="text-sm text-slate-500">{invoiceData.clientAddress}</p>
      </div>

      {/* Jadual Item (Dari POS) */}
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold uppercase text-slate-500">
            <th className="p-4">Deskripsi</th>
            <th className="p-4">Kuantiti</th>
            <th className="p-4">Harga Unit</th>
            <th className="p-4 text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {invoiceData.items.map((item, idx) => (
            <tr key={idx} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
              <td className="p-4 font-medium">{item.name}</td>
              <td className="p-4">{item.qty}</td>
              <td className="p-4 text-blue-500 font-semibold">RM {item.price}</td>
              <td className="p-4 text-right font-bold">RM {item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ringkasan Bayaran */}
      <div className="mt-8 flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal:</span>
            <span>RM {invoiceData.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Cukai (0%):</span>
            <span>RM 0.00</span>
          </div>
          <div className="flex justify-between text-xl font-black text-blue-600 pt-4 border-t dark:border-slate-800">
            <span>TOTAL:</span>
            <span>RM {invoiceData.total}</span>
          </div>
        </div>
      </div>

      {/* Footer Premium */}
      <div className="mt-16 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em]">
        Terima Kasih Kerana Berurusan Dengan Kami. Dikuasakan oleh KETICK OS.
      </div>
    </div>
  );
};

export default InvoiceTemplate;
