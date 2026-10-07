import { useState, useEffect } from "react";
import api from "../../utils/axios.js";

const Search = () => {
  const [hotels, setHotels] = useState([]);
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't search if uid is empty
    const fetchSearch = () => {
      if (!uid.trim()) {
        setHotels([]);
        return;
      }

      const timer = setTimeout(async () => {
        try {
          setLoading(true);
          if(!uid.trim()) return
          const response = await api.get(
            `/fetch/join-group?q=${encodeURIComponent(uid)}`,
          );

          console.log("Search response:", response.data);

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
    };

    fetchSearch();
  }, [uid]);

  return (
    <div>
      <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search" className="sr-only">
          Search
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
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

      {/* Display results */}
      {loading && <p className="text-center mt-4">Searching...</p>}

      {!loading && hotels.length > 0 && (
        <div className="mt-4 max-w-md mx-auto">
          {hotels.map((hotel) => (
            
            <div
              key={hotel._id}
              className="p-3 border rounded-lg mb-2 hover:bg-gray-50 cursor-pointer flex "
            > <div>
              <p className="font-medium">{hotel.name || hotel.uid}</p>
              <p className="text-sm text-gray-500">UID: {hotel.uid}</p>
              </div>
              <div className="ml-auto mr-5">Join</div>
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
