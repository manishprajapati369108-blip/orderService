import { useContext } from "react";
import { AuthContext } from "./createContext.jsx";

const useAuth = () => useContext(AuthContext);

export {useAuth};