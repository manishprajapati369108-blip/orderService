import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios.js";
import { AuthContext } from "./createContext.jsx";

const AuthProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
   const [groupAdminIds, setGroupAdminIds] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setAvatar(response.data.user.avatar);

        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setUserId(response.data.user.id);
        
      } catch (error) {
        console.log(error);
        setAvatar(null);
        setName(null);

        if (error.response?.status === 401) {
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const isAdmin = groupAdminIds?.includes(userId) ?? false;


  const value = {
    avatar,
    loading,
    userId,
    name,
    email,
    groupAdminIds,
    setGroupAdminIds,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
