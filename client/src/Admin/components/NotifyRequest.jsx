import { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import { useSocket } from "../context/useContext.jsx";

const NotifyRequest = () => {
  const [requests, setRequests] = useState([]);

  const socket = useSocket();

  const loadRequest = async () => {
    try {
      const response = await api.get("/fetch/join-requests");
      setRequests(response?.data?.list || []);
    } catch (error) {
      console.log(error);
    }
  };

  // initial load
  useEffect(() => {
    const load = () => {
    loadRequest();
    }

    load()
  }, []);

  // real-time: new request arrives
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (request) => {
      setRequests((prev) =>
        prev.some((r) => r._id === request._id) ? prev : [request, ...prev]
      );
    };

    socket.on("join-request:new", handleNewRequest);
    return () => socket.off("join-request:new", handleNewRequest);
  }, [socket]);

  // real-time: request handled by ANY admin (including me) → remove from list
  useEffect(() => {
    if (!socket) return;

    const handleHandled = ({ requestId }) => {
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    };

    socket.on("join-request:handled", handleHandled);
    return () => socket.off("join-request:handled", handleHandled);
  }, [socket]);

  const handleAccept = async (requestId) => {
    try {
      await api.patch(`/restaurant/join-request/${requestId}/accept`);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to accept";
      console.log(message); 

      // if it was already handled, silently remove it from the list
      if (message === "Request already handled") {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await api.patch(`/restaurant/join-request/${requestId}/decline`);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to decline";
      console.log(message);

      if (message === "Request already handled") {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    }
  };

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request._id}
          className="flex items-center gap-4 p-4 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition"
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-green-100 shrink-0 flex items-center justify-center">
            {request?.image ? (
              <img
                src={request.image}
                alt={request.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-green-600 font-bold">
                {request?.name?.charAt(0).toUpperCase() ?? "?"}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">
              {request?.name ?? "Unknown user"}
            </h3>
            <p className="text-sm text-gray-500 truncate">{request.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(
                request.requestedAt ?? request.createdAt
              ).toLocaleString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleAccept(request._id)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => handleDecline(request._id)}
              className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg transition"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotifyRequest;