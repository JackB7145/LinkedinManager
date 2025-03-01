import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUser] = useState(localStorage.getItem("username") || null);
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("username"));
  return (
    <AuthContext.Provider value={{ username, setUser, isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
};