import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/axios.js";
import { useAuth } from "../context/useContext.jsx"

const HotelPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { groupId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupUid, setGroupUid] = useState("");
  const [message, setMessage] = useState("");
  const {setGroupAdminIds} = useAuth()
 

  const linkClass =
    "flex items-center px-3 py-2.5 text-green-700 rounded-lg hover:bg-green-100 hover:text-green-900 group transition-colors";

  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/fetch/${groupId}`);
        const result = data?.result ?? {};
        setParticipants(result.participants ?? []);
        setGroupUid(result.uid ?? "");
        setGroupName(result.name ?? "");
        setGroupAvatar(result.avatar ?? null);
        setGroupAdminIds(result.groupAdmin);
      } catch (error) {
        console.error("Error:", error);
        setMessage(
          error.response?.data?.message || "Failed to load group details",
        );
      }
    };

    if (groupId) fetchDetails();
  }, [groupId, setGroupAdminIds]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 z-30 flex items-center w-full h-16 px-4 bg-white border-b border-green-200 sm:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="inline-flex items-center justify-center p-2 text-green-700 rounded-lg hover:bg-green-100 focus:outline-none"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-green-200">
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
        <div className="mx-auto max-w-4xl space-y-6">
          {/* ── Group Header ───────────────────────────────── */}
          <section className="overflow-hidden bg-white border border-green-100 rounded-2xl shadow-sm">
            {/* Slimmer banner */}
            <div className="h-16 bg-linear-to-r bg-amber-50" />

            {/* Header row */}
            <div className="flex items-center gap-4 px-5 pb-4 -mt-10">
              <img
                src={groupAvatar || "https://i.pravatar.cc/150?img=12"}
                alt={groupName || "Group"}
                className="w-16 h-16 rounded-full object-cover bg-white ring-4 ring-white"
              />
              <div className="min-w-0 pb-1">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {groupName || "Unnamed Group"}
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  ID: <span className="font-mono">{groupUid || "—"}</span>
                </p>
              </div>
            </div>

            {message && (
              <p className="px-5 pb-3 text-sm text-red-500">{message}</p>
            )}
          </section>
          {/* ── Participants ───────────────────────────────── */}
          <section className="p-5 bg-white border border-green-100 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Participants
              </h2>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                {participants.length}
              </span>
            </div>

            {participants.length === 0 ? (
              <p className="text-sm text-gray-400">No participants yet.</p>
            ) : (
              /* horizontal scroll lane */
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-green-200">
                {participants.map((p) => (
                  <div
                    key={p._id}
                    className="flex flex-col items-center shrink-0 w-20"
                  >
                    <img
                      src={p.avatar || "https://i.pravatar.cc/100"}
                      alt={p.name}
                      className="w-16 h-16 rounded-full border-2 border-green-200 object-cover bg-gray-100"
                    />
                    <span className="mt-2 w-full text-xs font-medium text-center text-gray-700 truncate">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Below participants (content area) ───────────── */}

          <section className="p-5 bg-white border border-green-100 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                Group Activity
              </h2>
              <span className="text-xs text-gray-400">Quick actions</span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {[
                { label: "Notice", icon: "📢", path: "notice" },
                { label: "Message", icon: "✉️", path: "message" },
                { label: "Menu", icon: "🍽️", path: "menu" },
                { label: "Orders", icon: "🧾", path: "orders" },
                { label: "Feedback", icon: "⭐", path: "feedback" },
              ].map(({ label, icon, path }) => (
                <Link to={`/hotel/${groupId}/${path}`}
                  key={label}
                  type="button"
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-green-100 bg-green-50/50 py-4 transition hover:border-green-300 hover:bg-green-100 active:scale-95"
                >
                  <span className="text-2xl transition group-hover:scale-110">
                    {icon}
                  </span>
                  <span className="text-xs font-medium text-green-800">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HotelPage;
