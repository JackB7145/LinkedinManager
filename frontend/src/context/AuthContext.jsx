import { createContext, useState } from "react";

//Basic auth context for general application
export const AuthContext = createContext();


//Exporting the auth context to be used in the index.js file
export const AuthProvider = ({ children }) => {

  //Use state fields modified through the application
  const [username, setUser] = useState(localStorage.getItem("username") || null);
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("username"));

  //Returning the auth provider 
  return (
    <AuthContext.Provider value={{ username, setUser, isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
};