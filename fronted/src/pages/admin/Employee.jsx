import { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaCamera,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import api from "../../api/api";
import Swal from "sweetalert2";

const Employees = () => {
  const [openModal, setOpenModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState(""); // Search State

  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    gender: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- GET DATA WITH SEARCH ---
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

  // Debouncing logic: User ke rukne ke 500ms baad search trigger hoga
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // --- DELETE HANDLER ---
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/delete-employee/${id}`);
          Swal.fire("Deleted!", "Record has been deleted.", "success");
          fetchEmployees(search);
        } catch (error) {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      designation: "",
      gender: "",
    });
    setImage(null);
    setEditMode(false);
    setSelectedId(null);
  };

  const handleEditClick = (emp) => {
    setEditMode(true);
    setSelectedId(emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      password: "",
      phone: emp.phone || "",
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
        if (key === "password" && !form[key]) return;
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("profile_image", image);
      }

      const url = editMode
        ? `/admin/update-employee/${selectedId}`
        : "/admin/create-employee";
      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: editMode ? "Updated!" : "Created!",
        timer: 2000,
        showConfirmButton: false,
      });
      setOpenModal(false);
      resetForm();
      fetchEmployees(search);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* HEADER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Employees List</h2>

        <div className="flex w-full md:w-auto gap-3">
          {/* SEARCH BAR */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Name, Email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition whitespace-nowrap"
          >
            <FaPlus /> Create
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Picture</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Designation</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-10 text-gray-400 italic"
                >
                  Searching database...
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-gray-600 font-mono text-sm">
                    {emp.id}
                  </td>
                  <td className="p-4">
                    <img
                      src={
                        emp.profile_image
                          ? `http://localhost:8000/storage/${emp.profile_image}`
                          : "https://via.placeholder.com/40"
                      }
                      alt="profile"
                      className="w-10 h-10 rounded-full border border-orange-400 object-cover p-0.5"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{emp.name}</td>
                  <td className="p-4 text-gray-600">{emp.email}</td>
                  <td className="p-4 text-gray-600">
                    {emp.designation || "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4 text-lg">
                      <FaEdit
                        className="text-green-500 cursor-pointer hover:text-green-600"
                        onClick={() => handleEditClick(emp)}
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-600"
                        onClick={() => handleDelete(emp.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (Same as before) */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div
              className={`px-8 py-5 text-white flex justify-between items-center ${
                editMode ? "bg-emerald-600" : "bg-blue-600"
              }`}
            >
              <h3 className="text-2xl font-bold">
                {editMode ? "Update Employee" : "Create Employee"}
              </h3>
              <FaTimes
                className="cursor-pointer text-xl"
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
              />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Designation
                </label>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center justify-center gap-3 border-2 border-dashed p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                  <FaCamera className="text-xl text-blue-500" />
                  <span className="font-medium">
                    {image ? image.name : "Change Photo"}
                  </span>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all ${
                  loading
                    ? "bg-gray-400"
                    : editMode
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
