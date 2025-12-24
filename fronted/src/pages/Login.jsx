import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import api from "../api/Api";
import { AuthContext } from "../context/AuthContext";

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/login", data);
      login(res.data);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${res.data.user.name}`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Role based redirect
      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "employee") {
        navigate("/employee");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Info */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Admin & Employee login supported
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
