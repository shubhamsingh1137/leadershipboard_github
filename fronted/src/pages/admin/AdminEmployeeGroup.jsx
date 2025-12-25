import React, { useState, useEffect, useMemo } from "react";
import {
  FaUsers,
  FaPlus,
  FaCalendarAlt,
  FaProjectDiagram,
  FaUserCheck,
  FaTimes,
  FaEdit,
  FaTrashAlt,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import api from "../../api/Api.js";
import Swal from "sweetalert2";

const AdminEmployeeGroup = () => {
  const [employees, setEmployees] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Modal Search State
  const [empSearch, setEmpSearch] = useState("");

  const [formData, setFormData] = useState({
    group_name: "",
    project_name: "",
    start_date: "", // Backend ke 'start_date' se match karta hai
    end_date: "", // Backend ise 'deadline' ke naam se save karega
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.project_name.toLowerCase().includes(searchTerm.toLowerCase());

      const groupStart = new Date(group.start_date);
      const filterStart = startDateFilter ? new Date(startDateFilter) : null;
      const filterEnd = endDateFilter ? new Date(endDateFilter) : null;

      const matchesDate =
        (!filterStart || groupStart >= filterStart) &&
        (!filterEnd || new Date(group.deadline) <= filterEnd);

      return matchesSearch && matchesDate;
    });
  }, [groups, searchTerm, startDateFilter, endDateFilter]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(empSearch.toLowerCase())
    );
  }, [employees, empSearch]);

  const isOverdue = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(endDate);
    return deadline < today;
  };

  const openModal = (group = null) => {
    setEmpSearch("");
    if (group) {
      setIsEditing(true);
      setCurrentGroupId(group.id);
      setFormData({
        group_name: group.name,
        project_name: group.project_name,
        start_date: group.start_date || "", // Yahan data backend se map ho raha hai
        end_date: group.deadline || "",
        selectedEmployees: group.employees.map((emp) => emp.id),
      });
    } else {
      setIsEditing(false);
      setFormData({
        group_name: "",
        project_name: "",
        start_date: "",
        end_date: "",
        selectedEmployees: [],
      });
    }
    setShowModal(true);
  };

  const toggleEmployee = (id) => {
    const isSelected = formData.selectedEmployees.includes(id);
    const updated = isSelected
      ? formData.selectedEmployees.filter((item) => item !== id)
      : [...formData.selectedEmployees, id];
    setFormData({ ...formData, selectedEmployees: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedEmployees.length === 0) {
      return Swal.fire("Wait!", "Select at least one Employee!", "warning");
    }

    // Yeh Payload ab aapke Updated Laravel Controller se bilkul match karega
    const payload = {
      group_name: formData.group_name,
      project_name: formData.project_name,
      start_date: formData.start_date,
      deadline: formData.end_date, // Controller 'deadline' expect kar raha hai
      selectedEmployees: formData.selectedEmployees,
    };

    try {
      if (isEditing) {
        await api.put(`/admin/update-group/${currentGroupId}`, payload);
        Swal.fire("Updated!", "Group details modified.", "success");
      } else {
        await api.post("/admin/create-group", payload);
        Swal.fire("Success!", "New squad formed successfully.", "success");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Action failed",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you Sure?",
      text: "This group will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/delete-group/${id}`);
        Swal.fire("Deleted!", "Group has been removed.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error", "Delete failed.", "error");
      }
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-slate-50 flex flex-col h-full font-sans">
      {/* Header & Main Filters */}
      <div className="z-20 bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <FaUsers size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Project Squads
                </h1>
                <p className="text-slate-500 text-xs font-medium">
                  Manage Teams & Timelines
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <FaPlus size={14} /> New Group
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Squad or Project..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border-none focus:ring-2 ring-indigo-500 bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Launch:
              </span>
              <input
                type="date"
                className="flex-1 px-3 py-2 rounded-xl border-none bg-white text-sm"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Deadline:
              </span>
              <input
                type="date"
                className="flex-1 px-3 py-2 rounded-xl border-none bg-white text-sm"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setStartDateFilter("");
                setEndDateFilter("");
              }}
              className="text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl px-4 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 h-full flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                    Squad & Project
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                    Team
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                    Launch Date
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                    Deadline
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-20 text-center text-slate-400 font-bold animate-pulse"
                    >
                      SYNCING DATA...
                    </td>
                  </tr>
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-20 text-center text-slate-400 italic text-sm"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((group) => (
                    <tr
                      key={group.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="font-black text-slate-800 uppercase text-sm mb-1">
                          {group.name}
                        </div>
                        <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-bold">
                          <FaProjectDiagram size={10} /> {group.project_name}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-3">
                          {group.employees?.map((emp) => (
                            <img
                              key={emp.id}
                              src={`https://ui-avatars.com/api/?name=${emp.name}&background=random&color=fff&bold=true`}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              title={emp.name}
                              alt={emp.name}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-600">
                        {group.start_date || "---"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-lg ${
                            isOverdue(group.deadline)
                              ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                              : "text-slate-600"
                          }`}
                        >
                          {group.deadline}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {isOverdue(group.deadline) ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[9px] font-black bg-rose-100 text-rose-600 uppercase border border-rose-200">
                            <FaClock /> Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-600 uppercase border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(group)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(group.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-9999 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black text-slate-800">
                {isEditing ? "Modify Squad" : "New Squad Setup"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-rose-500 transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <form
                id="groupForm"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Squad Name
                  </label>
                  <input
                    required
                    value={formData.group_name}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 font-medium"
                    onChange={(e) =>
                      setFormData({ ...formData, group_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Project Title
                  </label>
                  <input
                    required
                    value={formData.project_name}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 font-medium"
                    onChange={(e) =>
                      setFormData({ ...formData, project_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Launch Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 font-medium"
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Deadline Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 font-medium"
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Select Members
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {formData.selectedEmployees.length} Selected
                    </span>
                  </div>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search employee..."
                      className="w-full pl-9 pr-4 py-3 bg-slate-100 rounded-xl border-none text-sm focus:ring-2 ring-indigo-500"
                      value={empSearch}
                      onChange={(e) => setEmpSearch(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => toggleEmployee(emp.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          formData.selectedEmployees.includes(emp.id)
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white text-slate-600 border border-transparent shadow-sm hover:border-indigo-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${emp.name}&background=random&size=32`}
                            className="w-7 h-7 rounded-lg"
                            alt=""
                          />
                          <span className="font-bold text-xs">{emp.name}</span>
                        </div>
                        {formData.selectedEmployees.includes(emp.id) && (
                          <FaUserCheck size={12} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex gap-4 shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600"
              >
                Discard
              </button>
              <button
                type="submit"
                form="groupForm"
                className="flex-2 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
              >
                {isEditing ? "Save Changes" : "Create Squad"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeGroup;
