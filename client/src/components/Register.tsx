import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/users"; // adjust your backend URL

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);
      formData.append("role", role);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const res = await axios.post(`${API_BASE_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage(res.data.message || "Registration successful!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-extrabold text-white">
          Register
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] py-8 px-6 shadow rounded-lg sm:px-10">
          <form
            onSubmit={handleRegister}
            encType="multipart/form-data"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 placeholder-gray-500 shadow-sm focus:border-[#e50914] focus:outline-none focus:ring focus:ring-[#e50914] sm:text-sm text-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 placeholder-gray-500 shadow-sm focus:border-[#e50914] focus:outline-none focus:ring focus:ring-[#e50914] sm:text-sm text-white"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-white"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                pattern="\d{10}"
                title="Phone number must be 10 digits"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 placeholder-gray-500 shadow-sm focus:border-[#e50914] focus:outline-none focus:ring focus:ring-[#e50914] sm:text-sm text-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 placeholder-gray-500 shadow-sm focus:border-[#e50914] focus:outline-none focus:ring focus:ring-[#e50914] sm:text-sm text-white"
              />
            </div>

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
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#333] px-3 py-2 shadow-sm focus:border-[#e50914] focus:outline-none focus:ring focus:ring-[#e50914] sm:text-sm text-white"
              >
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-white"
              >
                Profile Picture (optional)
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#e50914] hover:bg-[#f6121d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f6121d] text-sm font-semibold"
            >
              Register
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-red-600 whitespace-pre-wrap">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
