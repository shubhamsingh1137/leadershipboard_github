import React, { useState } from "react";
import { FaTimes, FaFileImport } from "react-icons/fa";

const ImportCSVModal = ({ isOpen, onClose, onImport }) => {
  const [csvLink, setCsvLink] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[10001] p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-emerald-500 text-white">
          <h2 className="text-xl font-black">Import Squads</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">
              Option 1: Computer se Upload karein
            </label>
            <div
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-emerald-400 transition-all cursor-pointer bg-slate-50"
              onClick={() => document.getElementById("csvInputFile").click()}
            >
              <FaFileImport
                className="mx-auto text-emerald-500 mb-2"
                size={30}
              />
              <p className="text-sm font-bold text-slate-700">
                Click to Select CSV
              </p>
              <input
                id="csvInputFile"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  onImport(e);
                  onClose();
                }}
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <span className="bg-white px-2 text-[10px] font-black text-slate-300 z-10">
              YA PHIR
            </span>
            <div className="absolute w-full h-[1px] bg-slate-100"></div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">
              Option 2: Direct Link Paste karein
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/file.csv"
                className="flex-1 p-3 bg-slate-100 rounded-xl border-none text-sm focus:ring-2 ring-emerald-500"
                value={csvLink}
                onChange={(e) => setCsvLink(e.target.value)}
              />
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
