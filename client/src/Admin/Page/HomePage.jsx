import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import { useAuth } from "../context/useContext.jsx";
import api from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSocket } from "../context/useContext.jsx";

const HomePage = () => {
  const { avatar, name, email} = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [count, setCount] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    initFlowbite();
  }, []);

  const loadCount = async () => {
    try {
      const response = await api.get("/fetch/unread-count");
      setCount(response?.data?.count);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/logout", {});
      
      navigate("/auth");
    } catch (error) {
      console.log("Server Error:", error);
      
      navigate("/auth");
    }
  };

  //fetching the restaurant where i am  a member
  useEffect(() => {
    const fetchingHotel = async () => {
      try {
        const response = await api.get("/fetch/connected-restaurant");

        setGroups(response?.data?.group);
      } catch (error) {
        console.log(error);
      }
    };

    fetchingHotel();
  }, []);

  //fetching count

  useEffect(() => {
    const initialCount = () => {
      loadCount();
    };

    initialCount();
  }, []);

  //when new request comes
  useEffect(() => {
    const newCount = () => {
      loadCount();
    };

    socket.on("newRequestMessage", newCount);

    return () => {
      socket.off("newRequestMessage", newCount);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- NAV ---------- */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-green-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="top-bar-sidebar"
                data-drawer-toggle="top-bar-sidebar"
                aria-controls="top-bar-sidebar"
                type="button"
                className="sm:hidden text-green-800 bg-transparent border border-transparent hover:bg-green-100 focus:ring-4 focus:ring-green-200 font-medium leading-5 rounded text-sm p-2 focus:outline-none"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
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
                    strokeWidth="2"
                    d="M5 7h14M5 12h14M5 17h10"
                  />
                </svg>
              </button>

              <a href="/" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-6 me-3"
                  alt="Logo"
                />
                <span className="self-center text-lg font-semibold whitespace-nowrap text-green-700">
                  Order Service
                </span>
              </a>
            </div>

            <div className="flex items-center">
              <div>
                <button
                  type="button"
                  className="relative inline-flex items-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  <Link to="/requests">
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                    </svg>

                    {count > 0 ? (
                      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-danger border-2 border-buffer rounded-full -top-2 inset-e-2">
                        {count}
                      </div>
                    ) : (
                      ""
                    )}
                  </Link>
                </button>
              </div>
              <div className="flex items-center ms-3">
                <button
                  type="button"
                  className="flex text-sm bg-green-700 rounded-full focus:ring-4 focus:ring-green-300"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={avatar}
                    alt="user photo"
                  />
                </button>

                <div
                  className="z-50 hidden bg-white border border-green-200 rounded shadow-lg w-44"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3 border-b border-green-200">
                    <p className="text-sm font-medium text-green-800">{name}</p>
                    <p className="text-sm text-green-600 truncate">{email}</p>
                  </div>
                  <ul className="p-2 text-sm text-green-700 font-medium">
                    <li>
                      <a
                        href="/dashboard"
                        className="inline-flex items-center w-full p-2 hover:bg-green-100 hover:text-green-900 rounded"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center w-full p-2 text-left hover:bg-green-100 hover:text-green-900 rounded"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
                    
      {/* ---------- SIDEBAR ---------- */}
      <aside
        id="top-bar-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-e border-green-200">
          <a href="/" className="flex items-center ps-2.5 mb-5">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 me-3"
              alt="Logo"
            />
            <span className="self-center text-lg text-green-700 font-semibold whitespace-nowrap">
              Flowbite
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/dashboard"
                className="flex items-center px-2 py-1.5 text-green-700 rounded hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="w-5 h-5 group-hover:text-green-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
                  />
                </svg>
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/kanban"
                className="flex items-center px-2 py-1.5 text-green-700 rounded hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 group-hover:text-green-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                <span className="bg-green-100 border border-green-300 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded-sm">
                  Pro
                </span>
              </a>
            </li>
            <li>
              <a
                href="/inbox"
                className="flex items-center px-2 py-1.5 text-green-700 rounded hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 group-hover:text-green-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span className="inline-flex items-center justify-center w-5 h-5 ms-2 text-xs font-medium text-white bg-green-600 border border-green-700 rounded-full">
                  2
                </span>
              </a>
            </li>
            <li>
              <a
                href="/users"
                className="flex items-center px-2 py-1.5 text-green-700 rounded hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 group-hover:text-green-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="flex items-center px-2 py-1.5 text-green-700 rounded hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 group-hover:text-green-900"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* ---------- MAIN ---------- */}
      <main className="pt-20 sm:ml-64 p-4">
        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            to="/create"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-lg shadow-sm transition"
          >
            List Restaurant
          </Link>

          <button
            type="button"
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-5 py-3 rounded-lg border border-green-300 transition"
          >
            {" "}
            <Link to="/join-hotel">Join Restaurant</Link>
          </button>
        </div>

        {/* Restaurants */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Joined Hotels
          </h2>

          {groups.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">
                You haven't joined any restaurants yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="flex items-center gap-4 p-4 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition cursor-pointer"
                >
                  {/* Restaurant avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-green-100 shrink-0">
                    {group.avatar ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={group.avatar}
                          alt="preview"
                          className="w-full h-full object-cover scale-125"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-600 font-bold">
                        {group.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Restaurant information */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {group.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      <strong>ID</strong> {group.uid}
                    </p>
                  </div>

                  {/* Arrow */}
                  <Link to={`/hotel/${group._id}`}>
                    <svg
                      className="w-6 h-6 text-emerald-400"
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
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
