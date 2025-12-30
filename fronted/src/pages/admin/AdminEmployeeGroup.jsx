import React, { useState, useEffect, useMemo } from "react";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaFileImport,
} from "react-icons/fa";
import api from "../../api/Api.js";
import Swal from "sweetalert2";
import Papa from "papaparse";
import SquadDetailModal from "./squadparts/SquadDetailModal.jsx";
import ImportCSVModal from "./squadparts/ImportCSVModal.jsx";
import SquadFormModal from "./squadparts/SquadFormModal.jsx";

const AdminEmployeeGroup = () => {
  const [employees, setEmployees] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [empSearch, setEmpSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [formData, setFormData] = useState({
    group_name: "",
    selectedEmployees: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, groupRes] = await Promise.all([
        api.get("/admin/employees"),
        api.get("/admin/groups"),
      ]);
      setEmployees(empRes.data.data);
      setGroups(groupRes.data.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === 1. CSV IMPORT LOGIC (Updated to call Backend API) ===
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Frontend validation: Check if file has data
            if (results.data.length === 0) {
              return Swal.fire(
                "Empty File",
                "The CSV has no data rows.",
                "warning"
              );
            }

            Swal.fire({
              title: "Importing...",
              text: "Please wait while we process the squads",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            // Calling the backend API we just created
            const response = await api.post("/admin/import-groups-csv", {
              data: results.data,
            });

            Swal.fire(
              "Success",
              response.data.message || "Squads Imported!",
              "success"
            );
            setShowImportModal(false);
            fetchData(); // Refresh table
          } catch (err) {
            console.error("Import Error:", err);
            Swal.fire(
              "Error",
              "Import Failed. Check CSV format (group_name, employees).",
              "error"
            );
          }
        },
      });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      setGroups((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
      );

      await api.patch(`/admin/group-status/${id}`, { status: newStatus });
    } catch (error) {
      setGroups((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: currentStatus } : g))
      );
      Swal.fire("Error", "Status Update Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/delete-group/${id}`);
        setGroups(groups.filter((g) => g.id !== id));
        Swal.fire("Deleted!", "The squad has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete the squad.", "error");
      }
    }
  };

  const openModal = (group = null) => {
    setEmpSearch("");
    if (group) {
      setIsEditing(true);
      setCurrentGroupId(group.id);
      setFormData({
        group_name: group.name,
        selectedEmployees: group.employees.map((e) => e.id),
      });
    } else {
      setIsEditing(false);
      setFormData({ group_name: "", selectedEmployees: [] });
    }
    setShowModal(true);
  };

  const toggleEmployee = (id) => {
    const updated = formData.selectedEmployees.includes(id)
      ? formData.selectedEmployees.filter((item) => item !== id)
      : [...formData.selectedEmployees, id];
    setFormData({ ...formData, selectedEmployees: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing)
        await api.put(`/admin/update-group/${currentGroupId}`, formData);
      else await api.post("/admin/create-group", formData);

      setShowModal(false);
      fetchData();
      Swal.fire("Success!", "Squad data saved successfully", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to save data. Fill all required fields.",
        "error"
      );
    }
  };

  const filteredGroups = useMemo(
    () =>
      groups.filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [groups, searchTerm]
  );

  const renderSquadMembers = (employeesList) => {
    if (!employeesList || employeesList.length === 0) return null;

    const colors = [
      "bg-rose-500",
      "bg-indigo-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-sky-500",
      "bg-violet-500",
      "bg-pink-500",
    ];
    const limit = 3;
    const displayMembers = employeesList.slice(0, limit);
    const extraCount = employeesList.length - limit;

    return (
      <div className="flex -space-x-3 ml-4">
        {displayMembers.map((emp, index) => {
          let initials = "?";
          const fullName =
            emp.name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
          if (fullName) {
            const parts = fullName.split(" ");
            initials =
              parts.length >= 2
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : parts[0][0].toUpperCase();
          }
          return (
            <div
              key={index}
              title={fullName}
              className={`w-9 h-9 rounded-full ${
                colors[index % colors.length]
              } border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-md uppercase shrink-0 transition-transform hover:scale-110 hover:z-30`}
            >
              {initials}
            </div>
          );
        })}
        {extraCount > 0 && (
          <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-md shrink-0 z-10">
            +{extraCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-hidden bg-slate-50 flex flex-col h-full font-sans">
      {/* Header */}
      <div className="z-20 bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
              <FaUsers size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Project Squads
              </h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                Team Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative mr-2">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search squads..."
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 bg-slate-50"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm"
            >
              <FaFileImport size={14} /> Import
            </button>
            <button
              onClick={() => openModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm"
            >
              <FaPlus size={14} /> New Squad
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 h-full flex flex-col overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-slate-400">
              Loading Squads...
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b">
                    Squad Name & Members
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGroups.map((group) => (
                  <tr
                    key={group.id}
                    className={`hover:bg-indigo-50/30 transition-colors ${
                      group.status === "inactive"
                        ? "opacity-60 grayscale-[0.5]"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <span
                          onClick={() => {
                            setSelectedSquad(group);
                            setShowDetailModal(true);
                          }}
                          className="font-black text-slate-800 uppercase text-sm cursor-pointer hover:text-indigo-600 transition-colors"
                        >
                          {group.name}
                        </span>
                        {renderSquadMembers(group.employees)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={group.status !== "inactive"}
                          onChange={() =>
                            toggleStatus(group.id, group.status || "active")
                          }
                        />
                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span
                          className={`ml-3 text-[10px] font-bold uppercase ${
                            group.status === "inactive"
                              ? "text-rose-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {group.status || "active"}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSquad(group);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => openModal(group)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredGroups.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium">
              No squads found.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SquadDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        details={selectedSquad}
      />
      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleCSVImport}
      />
      <SquadFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        employees={employees}
        empSearch={empSearch}
        setEmpSearch={setEmpSearch}
        toggleEmployee={toggleEmployee}
      />
    </div>
  );
};

export default AdminEmployeeGroup;
