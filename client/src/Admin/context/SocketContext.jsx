import { useEffect } from "react";
import { SocketContext } from "./createContext.jsx";
import { io } from "socket.io-client";

//we put this outside because we want only one time connection if we put inside the function when function runs again it may create more connection.
const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider };
