import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import { useAuth } from "../context/useContext.jsx";
import api from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { avatar, name, email } = useAuth();
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    initFlowbite();
  }, []);

  //logout

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/logout", {});
      console.log(response);
      setIsLoggedIn(false);
      if (response) {
        navigate("/auth");
      }
    } catch (error) {
      console.log("server Error :", error);
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-green-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="top-bar-sidebar"
                data-drawer-toggle="top-bar-sidebar"
                aria-controls="top-bar-sidebar"
                type="button"
                className="sm:hidden text-green-800 bg-transparent box-border border border-transparent hover:bg-green-100 focus:ring-4 focus:ring-green-200 font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
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
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-6 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-lg font-semibold whitespace-nowrap text-green-700">
                  Flowbite
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
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
                </div>
                <div
                  className="z-50 hidden bg-white border border-green-200 rounded-base shadow-lg w-44"
                  id="dropdown-user"
                >
                  <div
                    className="px-4 py-3 border-b border-green-200"
                    role="none"
                  >
                    <p
                      className="text-sm font-medium text-green-800"
                      role="none"
                    >
                      {name}
                    </p>
                    <p className="text-sm text-green-600 truncate" role="none">
                      {email}
                    </p>
                  </div>
                  <ul
                    className="p-2 text-sm text-green-700 font-medium"
                    role="none"
                  >
                    <li>
                      <a
                        href="#"
                        className="inline-flex items-center w-full p-2 hover:bg-green-100 hover:text-green-900 rounded"
                        role="menuitem"
                      >
                        Dashboard
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="inline-flex items-center w-full p-2 hover:bg-green-100 hover:text-green-900 rounded"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="top-bar-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-e border-green-200">
          <a
            href="https://flowbite.com/"
            className="flex items-center ps-2.5 mb-5"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 me-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-lg text-green-700 font-semibold whitespace-nowrap">
              Flowbite
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-green-700 rounded-base hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="w-5 h-5 transition duration-75 group-hover:text-green-900"
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
                href="#"
                className="flex items-center px-2 py-1.5 text-green-700 rounded-base hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-green-900"
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
                href="#"
                className="flex items-center px-2 py-1.5 text-green-700 rounded-base hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-green-900"
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
                    d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-white bg-green-600 border border-green-700 rounded-full">
                  2
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-green-700 rounded-base hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-green-900"
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
                    d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-green-700 rounded-base hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-green-900"
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
                    d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-green-700 rounded-base hover:bg-green-100 hover:text-green-900 group"
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-green-900"
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
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content area removed — navbar and sidebar untouched */}
    </div>
  );
};

export default HomePage;
