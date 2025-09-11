// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import socket from "../socket";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // Register socket whenever user changes
  useEffect(() => {
    if (user && user._id) {
      socket.emit("register", { userId: user._id });
      console.log("🔌 Registered socket for user:", user._id);
    } else {
      console.log("ℹ️ No user registered with socket");
    }
  }, [user]);

  const login = (userObj) => {
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
    socket.emit("register", { userId: userObj._id });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
    setTimeout(() => socket.connect(), 500); // reconnect cleanly
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
