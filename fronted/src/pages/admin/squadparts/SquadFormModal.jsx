import React from "react";
import { FaTimes, FaUserCheck, FaSearch } from "react-icons/fa";

const SquadFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  formData,
  setFormData,
  employees,
  empSearch,
  setEmpSearch,
  toggleEmployee,
}) => {
  if (!isOpen) return null;

  const filteredEmployees = employees
    .filter((emp) => emp.name.toLowerCase().includes(empSearch.toLowerCase()))
    .sort((a, b) => {
      const aSel = formData.selectedEmployees.includes(a.id);
      const bSel = formData.selectedEmployees.includes(b.id);
      return bSel - aSel; // Selected wale top par
    });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[9999] p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800">
            {isEditing ? "Modify Squad" : "New Squad Setup"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          <form id="squadForm" onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                Squad Name
              </label>
              <input
                required
                placeholder="E.g. Alpha Team"
                value={formData.group_name}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, group_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Select Members
                </label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {formData.selectedEmployees.length} Selected
                </span>
              </div>
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-100 rounded-xl border-none text-sm focus:ring-2 ring-indigo-500"
                />
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-100">
                {filteredEmployees.map((emp) => {
                  const isSelected = formData.selectedEmployees.includes(
                    emp.id
                  );
                  return (
                    <div
                      key={emp.id}
                      onClick={() => toggleEmployee(emp.id)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white text-slate-600 border border-transparent hover:border-indigo-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${emp.name}&size=32`}
                          className="w-7 h-7 rounded-lg"
                          alt=""
                        />
                        <span className="font-bold text-xs">{emp.name}</span>
                      </div>
                      {isSelected && <FaUserCheck size={12} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 font-bold text-slate-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="squadForm"
            className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all"
          >
            {isEditing ? "Save Changes" : "Create Squad"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SquadFormModal;
