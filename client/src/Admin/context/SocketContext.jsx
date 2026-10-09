import { useEffect } from "react";
import { SocketContext } from "./createContext.jsx";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

const SocketProvider = ({ children }) => {
  useEffect(() => {
    const onConnect      = () => console.log("[socket] connected", socket.id);
    const onDisconnect   = (r) => console.log("[socket] disconnected", r);
    const onConnectError = (e) => console.error("[socket] error", e.message);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider };