import React, { useState, useRef } from "react";
import {
  FaTimes,
  FaFileImport,
  FaDownload,
  FaFileCsv,
  FaFileExcel,
  FaFileCode,
  FaExchangeAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";

const ImportCSVModal = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [tempFile, setTempFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // 1. File Selection Handler
  const handleFileSelection = (file) => {
    if (file) {
      setFileName(file.name);
      setTempFile(file);
    }
  };

  // 2. Sample Download
  const handleDownloadSample = () => {
    const headers =
      "employee_id,name,email,phone,designation,gender\nSIM-001,John Doe,john@example.com,9876543210,Developer,Male";
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    a.click();
  };

  // 3. Final Process & Upload
  const processAndUpload = (targetFormat) => {
    if (!tempFile) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];

      let finalBlob, extension, mime;

      if (targetFormat === "csv") {
        finalBlob = new Blob([XLSX.utils.sheet_to_csv(ws)], {
          type: "text/csv",
        });
        extension = ".csv";
        mime = "text/csv";
      } else if (targetFormat === "json") {
        finalBlob = new Blob([JSON.stringify(XLSX.utils.sheet_to_json(ws))], {
          type: "application/json",
        });
        extension = ".json";
        mime = "application/json";
      } else {
        finalBlob = tempFile; // Original Excel
        extension = ".xlsx";
        mime = tempFile.type;
      }

      const fileToUpload = new File(
        [finalBlob],
        fileName.replace(/\.[^/.]+$/, "") + extension,
        { type: mime }
      );
      onImport({ target: { files: [fileToUpload] } });
      onClose();
      setFileName("");
      setTempFile(null);
    };
    reader.readAsBinaryString(tempFile);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex justify-center items-center z-10002 p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        {/* LEFT SIDE: Info & Template (Dark Section) */}
        <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black mb-2">Import Center</h2>
            <p className="text-xs opacity-70 font-medium leading-relaxed">
              Upload your staff data using our smart converter. Choose your
              preferred format for the server.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">
                Need a starting point?
              </p>
              <button
                onClick={handleDownloadSample}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-50 transition-all shadow-lg"
              >
                <FaDownload /> DOWNLOAD TEMPLATE
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Upload & Actions */}
        <div className="flex-1 p-8 bg-slate-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">
              Single Page Configuration
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-rose-500"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* 1. Universal Dropzone */}
          <div
            onClick={() => fileInputRef.current.click()}
            className={`border-4 border-dashed rounded-4xl p-8 text-center transition-all cursor-pointer mb-8 ${
              fileName
                ? "border-emerald-400 bg-emerald-50/50"
                : "border-slate-200 bg-white hover:border-indigo-400"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => handleFileSelection(e.target.files[0])}
            />
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-sm ${
                fileName
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {fileName ? <FaExchangeAlt /> : <FaFileImport />}
            </div>
            <p className="text-sm font-black text-slate-700">
              {fileName ? fileName : "Click or Drag File Here"}
            </p>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
              Supports Excel & CSV
            </p>
          </div>

          {/* 2. Format Selection (Visible Always) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="md:col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Convert & Upload as:
            </label>

            <button
              onClick={() => processAndUpload("csv")}
              className="flex flex-col items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:shadow-xl transition-all group"
            >
              <FaFileCsv
                className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <span className="text-[10px] font-black text-slate-600">
                CSV FILE
              </span>
            </button>

            <button
              onClick={() => processAndUpload("xlsx")}
              className="flex flex-col items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all group"
            >
              <FaFileExcel
                className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <span className="text-[10px] font-black text-slate-600">
                EXCEL SHEET
              </span>
            </button>

            <button
              onClick={() => processAndUpload("json")}
              className="flex flex-col items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-800 hover:shadow-xl transition-all group"
            >
              <FaFileCode
                className="text-slate-400 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <span className="text-[10px] font-black text-slate-600">
                JSON DATA
              </span>
            </button>
          </div>

          <p className="text-center mt-6 text-[10px] text-slate-400 font-medium">
            Note: Choosing a format will automatically convert your file and
            start the upload.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
