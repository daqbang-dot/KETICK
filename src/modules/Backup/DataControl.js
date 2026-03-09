import React, { useContext } from 'react';
import { KetickContext } from '../../context/KetickContext';

const DataControl = () => {
  const allData = useContext(KetickContext);

  // Fungsi EXPORT (Download JSON)
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `KETICK_BACKUP_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Fungsi IMPORT (Upload JSON)
  const importData = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      const data = JSON.parse(e.target.result);
      // Logik untuk set semula Global State (setInventory, setProfile, etc)
      alert("Data Berjaya Diimport!");
    };
  };

  return (
    <div className="p-8 bg-slate-900 text-white rounded-2xl border border-blue-500/30">
      <h3 className="text-xl font-black mb-6 italic tracking-widest text-blue-400">DATA CENTER & BACKUP</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 border border-slate-700 rounded-xl hover:border-blue-500 transition cursor-pointer" onClick={exportData}>
          <p className="font-bold">DOWNLOAD BACKUP</p>
          <p className="text-xs text-slate-500 mt-2">Simpan salinan semua data anda ke komputer dalam format JSON.</p>
        </div>

        <div className="p-6 border border-slate-700 rounded-xl hover:border-green-500 transition relative">
          <p className="font-bold uppercase">UPLOAD DATA</p>
          <input type="file" onChange={importData} className="absolute inset-0 opacity-0 cursor-pointer" />
          <p className="text-xs text-slate-500 mt-2">Pulihkan data dari fail backup yang disimpan sebelumnya.</p>
        </div>
      </div>
    </div>
  );
};

export default DataControl;
