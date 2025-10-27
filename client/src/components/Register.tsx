import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import api from "../api/axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = new FormData();
      for (const key in formData) payload.append(key, formData[key]);
      if (profilePicture) payload.append("profilePicture", profilePicture);

      const { data } = await api.post("/users/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(data.message || "Registration successful!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
      {/* Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-extrabold text-white tracking-wide mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-400">Join us and explore amazing features!</p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] py-10 px-8 shadow-2xl rounded-2xl sm:px-10 relative">
          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-6">
            <label
              htmlFor="profilePicture"
              className="relative group cursor-pointer"
            >
              <div className="w-28 h-28 rounded-full border-4 border-[#e50914] overflow-hidden bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-gray-400 w-10 h-10 group-hover:text-white transition" />
                )}
              </div>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="absolute bottom-1 right-1 bg-[#e50914] text-white rounded-full p-1 shadow-lg">
                <Camera className="w-4 h-4" />
              </div>
            </label>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleRegister}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {["username", "email", "phoneNumber", "password"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-white capitalize"
                >
                  {field === "phoneNumber" ? "Phone Number" : field}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 text-white placeholder-gray-500 focus:border-[#e50914] focus:ring-[#e50914] focus:outline-none transition"
                />
              </div>
            ))}

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-white"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 text-white focus:border-[#e50914] focus:ring-[#e50914] focus:outline-none"
              >
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-[#e50914] hover:bg-[#f6121d] focus:outline-none font-semibold transition-colors"
            >
              Register
            </button>
          </form>

          {/* Success / Error Message */}
          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                message.includes("successful")
                  ? "text-green-500"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Already Have Account */}
          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#e50914] hover:text-[#f6121d] font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
