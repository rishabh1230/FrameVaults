import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    // Save tokens first
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken || "");

    // Fetch user info from backend
    api
      .get("/users/google/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const user = res.data.data.user;
        if (user) {
          // Update context & localStorage
          login(user);
          localStorage.setItem("framevault_user", JSON.stringify(user));
          navigate("/profile"); // redirect after login
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Google callback error:", err);
        navigate("/login");
      });
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      Signing you in with Google...
    </div>
  );
};

export default GoogleCallback;