import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { AuthContext } from "./createContext.jsx";

const AuthProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");

        setAvatar(response?.data?.user?.avatar);
        setCurrentUser(response?.data?.user?._id);
        const isLogged = response?.data?.user;

        if (!isLogged) {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const value = {
    setAvatar,
    avatar,
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
