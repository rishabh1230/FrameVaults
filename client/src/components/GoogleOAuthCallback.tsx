import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function fetchGoogleUser() {
      try {
        // Fetch user info and tokens from backend after successful OAuth
        const response = await fetch("/api/auth/google/user", {
          credentials: "include", // send cookies if any
        });
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();

        const accessToken = data.data.accessToken;
        const user = data.data.user;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("framevault_user", JSON.stringify(user));
        login(user);

        navigate("/"); // redirect to homepage or elsewhere
      } catch (error) {
        console.error("Google OAuth login failed", error);
        navigate("/login");
      }
    }

    fetchGoogleUser();
  }, [login, navigate]);

  return <div>Logging in with Google...</div>;
};

export default GoogleOAuthCallback;
