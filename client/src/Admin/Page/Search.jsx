import { useState, useEffect } from "react";
import api from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [hotels, setHotels] = useState([]);
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const searchFetch = () => {
    if (!uid.trim()) {
      setHotels([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/fetch/join-group?q=${encodeURIComponent(uid)}`
        );
        if (response.data.success) {
          setHotels(response.data.data);
        }
      } catch (error) {
        console.error("Search error:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);

  }

  searchFetch()
  }, [uid]);

  const handleJoin = async (hotelId) => {
    try {
      const response = await api.post(`/restaurant/${hotelId}/join-request`);
      setMessage(response?.data?.message ?? "Request sent");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      console.log("Error:", error);
      console.log("Status:", error.response?.status);
    console.log("Server says:", error.response?.data);
      setMessage(error?.response?.data?.message ?? "Something went wrong");
    }
  };

  if (message) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div>
      <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" /* ... */ />
          </div>
          <input
            type="search"
            id="search"
            className="block mt-10 w-full p-3 pl-9 pr-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
            placeholder="Search By Id"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
        </div>
      </form>

      {loading && <p className="text-center mt-4">Searching...</p>}

      {!loading && hotels.length > 0 && (
        <div className="mt-4 max-w-md mx-auto">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="p-3 border rounded-lg mb-2 hover:bg-gray-50 flex items-center"
            >
              <div>
                <p className="font-medium">{hotel.name || hotel.uid}</p>
                <p className="text-sm text-gray-500">UID: {hotel.uid}</p>
              </div>
              <button
                type="button"
                className="ml-auto mr-5 px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => handleJoin(hotel._id)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && uid.trim() && hotels.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No restaurants found</p>
      )}
    </div>
  );
};

export default Search;