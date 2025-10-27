import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  // Load user and token from localStorage (on app start)
  useEffect(() => {
    const storedUser = localStorage.getItem("framevault_user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("framevault_user");
      }
    }
    if (storedToken) {
      localStorage.setItem("accessToken", storedToken); // ensure token is set
    }
  }, []);

  // Login updates user and token state
  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem("framevault_user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
  };

  // Logout clears everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("framevault_user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
