import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
        setUser(null);
      }
    };

    if (token) getUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loggedIn, setLoggedIn, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
