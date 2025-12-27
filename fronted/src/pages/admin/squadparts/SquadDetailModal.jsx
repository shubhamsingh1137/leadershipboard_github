import React from "react";
import { FaTimes } from "react-icons/fa";

const SquadDetailModal = ({ isOpen, onClose, details }) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[10000] p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {details.name}
            </h2>
            <p className="text-indigo-100 text-xs italic">
              Squad Members & Roles
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="space-y-4">
            {details.employees?.map((emp) => (
              <div
                key={emp.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${emp.name}&background=random`}
                  className="w-10 h-10 rounded-xl"
                  alt={emp.name}
                />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {emp.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 bg-white p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-indigo-500 uppercase text-[9px]">
                      Status:
                    </span>{" "}
                    {emp.current_task || "Active Member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquadDetailModal;
