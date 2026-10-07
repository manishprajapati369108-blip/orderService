import { useContext } from "react";
import { AuthContext, SocketContext } from "./createContext.jsx";

const useAuth = () => useContext(AuthContext);
const useSocket = () => useContext(SocketContext);

export {useAuth, useSocket};