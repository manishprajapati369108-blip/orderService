import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../utils/axios.js";

const HotelPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { groupId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState(null);
  const [groupUid, setGroupUid] = useState(null);

  const linkClass =
    "flex items-center px-3 py-2.5 text-green-700 rounded-lg hover:bg-green-100 hover:text-green-900 group transition-colors";

  const closeSidebar = () => setIsSidebarOpen(false);

  //fetching all information

  useEffect(() => {
    const fetchDetails = async() => {
      try {
        const r = await api.get(`/fetch/${groupId}`);
        console.log(r);
        setParticipants(r?.data?.result?.participants)
        setGroupUid(r?.data?.result?.uid);
        setGroupName(r?.data?.result?.uid);
        setGroupAvatar(r?.data?.result?.uid)
      } catch (error) {
        console.log("Error: ", error);
        setMessage(error.r);
      }
    };

    fetchDetails();
  }, [groupId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 z-30 flex items-center w-full h-16 px-4 bg-white border-b border-green-200 sm:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="inline-flex items-center justify-center p-2 text-green-700 rounded-lg hover:bg-green-100 focus:outline-none"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          aria-controls="top-bar-sidebar"
        >
          {isSidebarOpen ? (
            // Close icon
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        <Link
          to="/"
          className="flex items-center ml-3 text-lg font-semibold text-green-700"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="w-6 h-6 mr-2"
            alt="Logo"
          />
          Flowbite
        </Link>
      </header>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="top-bar-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-green-200">
          {/* Sidebar Logo */}
          <Link
            to="/"
            onClick={closeSidebar}
            className="hidden sm:flex items-center ps-2.5 mb-8"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-7 me-3"
              alt="Logo"
            />
            <span className="text-xl font-semibold text-green-700">
              Flowbite
            </span>
          </Link>

          {/* Navigation Links */}
          <ul className="mt-16 space-y-2 font-medium sm:mt-0">
            <li>
              <Link
                to="/dashboard"
                onClick={closeSidebar}
                className={linkClass}
              >
                <span className="text-lg">◉</span>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/kanban" onClick={closeSidebar} className={linkClass}>
                <span className="text-lg">▤</span>
                <span className="flex-1 ms-3">Kanban</span>
                <span className="px-2 py-0.5 text-xs text-green-800 bg-green-100 border border-green-300 rounded">
                  Pro
                </span>
              </Link>
            </li>

            <li>
              <Link to="/inbox" onClick={closeSidebar} className={linkClass}>
                <span className="text-lg">✉</span>
                <span className="flex-1 ms-3">Inbox</span>
                <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-green-600 rounded-full">
                  2
                </span>
              </Link>
            </li>

            <li>
              <Link to="/users" onClick={closeSidebar} className={linkClass}>
                <span className="text-lg">♙</span>
                <span className="ms-3">Users</span>
              </Link>
            </li>

            <li>
              <Link to="/products" onClick={closeSidebar} className={linkClass}>
                <span className="text-lg">▣</span>
                <span className="ms-3">Products</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-4 sm:ml-64 sm:pt-4">
        
      </main>
    </div>
  );
};

export default HotelPage;
