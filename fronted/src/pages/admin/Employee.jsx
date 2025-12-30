import { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileImport,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaUserTie,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api/Api";
import ImportCSVModal from "./squadparts/ImportCSVModal";

const Employee = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");

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
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- 1. GET DATA ---
  const fetchEmployees = useCallback(async (query = "") => {
    setLoadingList(true);
    try {
      const response = await api.get("/admin/employees", {
        params: { search: query, sort: "asc" },
      });
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchEmployees(search), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchEmployees]);

  // --- 2. DELETE FUNCTION ---
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/delete-employee/${id}`);
          Swal.fire("Deleted!", "Employee removed successfully.", "success");
          fetchEmployees(search);
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Deletion failed.",
            "error"
          );
        }
      }
    });
  };

  // --- 3. HANDLERS ---
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
    setImagePreview(null);
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
    setImagePreview(
      emp.profile_image
        ? `http://127.0.0.1:8000/storage/${emp.profile_image}`
        : null
    );
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "password" && editMode && !form[key]) return;
        if (form[key]) formData.append(key, form[key]);
      });
      if (image) formData.append("profile_image", image);

      const url = editMode
        ? `/admin/update-employee/${selectedId}`
        : "/admin/create-employee";
      await api.post(url, formData);

      setOpenModal(false);
      Swal.fire({
        icon: "success",
        title: editMode ? "Updated!" : "Created!",
        timer: 1500,
        showConfirmButton: false,
      });
      resetForm();
      fetchEmployees(search);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Operation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 p-4 bg-slate-50/50">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">
            Stable alignment & data management
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-50 font-bold text-sm shadow-sm"
          >
            <FaFileImport className="text-emerald-500" /> Import
          </button>
          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-bold text-sm shadow-md"
          >
            <FaPlus /> Add Employee
          </button>
        </div>
      </div>

      {/* FIXED TABLE SECTION */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto h-full">
          {/* Added table-fixed to keep columns stable */}
          <table className="w-full text-left border-separate border-spacing-0 table-fixed">
            <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="p-4 w-12 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  #
                </th>
                <th className="p-4 w-28 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  Emp ID
                </th>
                <th className="p-4 w-20 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  Profile
                </th>
                <th className="p-4 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  Name & Designation
                </th>
                <th className="p-4 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  Contact Info
                </th>
                <th className="p-4 w-32 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingList ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-20 text-center text-xs font-black text-slate-400"
                  >
                    LOADING RECORDS...
                  </td>
                </tr>
              ) : (
                employees.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 text-xs font-bold text-slate-400">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold">
                        {emp.employee_id}
                      </span>
                    </td>
                    <td className="p-4">
                      <img
                        src={
                          emp.profile_image
                            ? `http://127.0.0.1:8000/storage/${emp.profile_image}`
                            : `https://ui-avatars.com/api/?name=${emp.name}`
                        }
                        className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-white"
                        alt="profile"
                      />
                    </td>
                    <td className="p-4 truncate">
                      <p className="text-sm font-bold text-slate-700 leading-tight">
                        {emp.name}
                      </p>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                        {emp.designation || "Staff Member"}
                      </span>
                    </td>
                    <td className="p-4 truncate">
                      <div className="text-xs font-semibold text-slate-600">
                        {emp.email}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        {emp.phone || "No Phone"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-all"
                        >
                          <FaTrash />
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

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-100 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {editMode ? "Modify Details" : "New Registration"}
                </h3>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="p-2.5 bg-white shadow-sm hover:text-rose-500 rounded-2xl border border-slate-100"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-8 space-y-8"
            >
              {/* Profile Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-4xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FaCamera size={32} />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-2xl text-white cursor-pointer shadow-lg">
                    <FaPlus size={14} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-sm"
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">
                    Employee ID
                  </label>
                  <input
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-sm"
                    placeholder="e.g. EMP-001"
                  />
                </div>
                {/* Fixed the Password Warning by adding autoComplete */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase">
                    Password {editMode && "(Leave blank to keep same)"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required={!editMode}
                      autoComplete="current-password"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                {/* Other fields same... */}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-500"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl"
                >
                  {loading ? "Processing..." : editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={fetchEmployees}
      />
    </div>
  );
};

export default Employee;
