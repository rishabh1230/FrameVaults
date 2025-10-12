import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api/users"; // adjust your backend URL

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true } // send cookies if your backend uses them
      );
      setMessage("");
      // Store token, redirect or load home
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/"); // Redirect to home or desired page
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/google`;
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-extrabold text-white">
          Sign In
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#e50914] focus:border-[#e50914] sm:text-sm bg-[#333] text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#e50914] focus:border-[#e50914] sm:text-sm bg-[#333] text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#e50914] hover:bg-[#f6121d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f6121d] text-sm font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center py-3 px-4 rounded-md border border-white text-white hover:bg-white hover:text-[#e50914] transition text-sm font-semibold"
            >
              Sign in with Google
            </button>
          </div>

          {message && (
            <p className="text-sm text-red-600 mt-4 whitespace-pre-wrap">{message}</p>
          )}

          <p className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white hover:underline font-semibold"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
