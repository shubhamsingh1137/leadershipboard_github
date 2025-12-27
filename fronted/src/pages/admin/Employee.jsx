import { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileImport,
  FaUserCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import Swal from "sweetalert2";
import api from "../../api/Api";

const Employee = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    employee_id: "",
    designation: "",
    gender: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  // --- GET DATA ---
  const fetchEmployees = async (query = "") => {
    setLoadingList(true);
    try {
      const response = await api.get(`/admin/employees?search=${query}`);
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees(search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // --- HANDLERS ---
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setImporting(true);
    try {
      const response = await api.post("/admin/import-employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: "success",
        title: "Import Successful",
        text: response.data.message,
      });
      fetchEmployees();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Import Failed",
        text: error.response?.data?.message || "Error",
      });
    } finally {
      setImporting(false);
      e.target.value = null;
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      borderRadius: "15px",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/delete-employee/${id}`);
          Swal.fire("Deleted!", "Employee removed.", "success");
          fetchEmployees(search);
        } catch (error) {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      employee_id: "",
      designation: "",
      gender: "",
    });
    setImage(null);
    setEditMode(false);
    setSelectedId(null);
    setShowPassword(false);
  };

  const handleEditClick = (emp) => {
    setEditMode(true);
    setSelectedId(emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      password: "",
      phone: emp.phone || "",
      employee_id: emp.employee_id || "",
      designation: emp.designation || "",
      gender: emp.gender || "",
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "password" && editMode && !form[key]) return;
        formData.append(key, form[key]);
      });
      if (image) formData.append("profile_image", image);

      const url = editMode
        ? `/admin/update-employee/${selectedId}`
        : "/admin/create-employee";
      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: editMode ? "Updated!" : "Created!",
        timer: 1500,
        showConfirmButton: false,
      });
      setOpenModal(false);
      resetForm();
      fetchEmployees(search);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to save record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      {/* ================= TOP SECTION ================= */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Employee List
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage and monitor all company staff
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleImportCSV}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={importing}
            className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm shadow-sm"
          >
            <FaFileImport className="text-emerald-500" />{" "}
            {importing ? "..." : "Import"}
          </button>

          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-200"
          >
            <FaPlus /> Create Staff
          </button>
        </div>
      </div>

      {/* ================= TABLE AREA ================= */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1 custom-scrollbar relative">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr>
                {[
                  "Emp ID",
                  "Profile",
                  "Name",
                  "Contact Details",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="bg-slate-50/90 backdrop-blur-sm p-4 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingList ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                        Syncing Data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 group-hover:bg-white transition-colors">
                        {emp.employee_id || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative w-10 h-10">
                        <img
                          src={
                            emp.profile_image
                              ? `http://localhost:8000/storage/${emp.profile_image}`
                              : "https://ui-avatars.com/api/?name=" + emp.name
                          }
                          alt="profile"
                          className="w-full h-full rounded-xl object-cover ring-2 ring-white shadow-sm"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-800">
                        {emp.name}
                      </p>
                      <p className="text-[11px] text-indigo-500 font-medium">
                        {emp.designation || "Staff Member"}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-slate-600">
                          {emp.email}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {emp.phone || "No Phone"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="p-2 bg-white border border-slate-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all shadow-sm"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 bg-white border border-slate-200 text-rose-500 rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-20 text-center text-slate-400 font-medium"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-100 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div
              className={`px-8 py-6 flex justify-between items-center ${
                editMode ? "bg-emerald-600" : "bg-indigo-600"
              }`}
            >
              <div className="text-white">
                <h3 className="text-xl font-black tracking-tight">
                  {editMode ? "Edit Employee" : "New Registration"}
                </h3>
                <p className="text-xs opacity-80 font-medium">
                  Please fill in all the required information
                </p>
              </div>
              <button
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
                className="w-10 h-10 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white rounded-full transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="md:col-span-2 flex justify-center mb-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-500 transition-all">
                    <FaUserCircle size={40} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                    <FaPlus size={10} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Employee ID
                </label>
                <input
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  placeholder="SIM-2024-001"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@simpel.ai"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Designation
                </label>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Senior Manager"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* Updated Password Field Logic */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={editMode ? "Leave empty to keep" : "••••••••"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl transition-all active:scale-95 ${
                  loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : editMode
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                }`}
              >
                {loading
                  ? "Processing..."
                  : editMode
                  ? "Update Records"
                  : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
