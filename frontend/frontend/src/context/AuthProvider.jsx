import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./authContext.jsx";

const restoreUser = () => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

export const TanishqProvider = ({ children }) => {
  const [user, setUser] = useState(restoreUser);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { User } = response.data;
      const { token, username, email: userEmail, id } = User;
      const currentUser = { username, email: userEmail, id };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(currentUser));
      setUser(currentUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    await api.post("/api/auth/register", { username, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};