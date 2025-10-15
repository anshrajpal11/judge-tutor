import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) return setUser(null);
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // ignore
    }
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-black rounded-md p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2L3 7v7c0 5 3.8 9 9 9s9-4 9-9V7l-9-5zM11 11h2v6h-2v-6z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-800 leading-tight">
                Judge<span className="text-gray-400">Tutor</span>
              </div>
              <div className="text-xs text-gray-500">Find & rate teachers</div>
            </div>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex md:space-x-6 md:items-center">
            <Link
              to="/teachers"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Teachers
            </Link>
            <Link
              to="/rankings"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Rankings
            </Link>
            <Link
              to="/add-review"
              className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            >
              Add Review
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop auth area */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setOpen((s) => !s)}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = `https://via.placeholder.com/40x40/6366f1/ffffff?text=${
                          user.name?.charAt(0) || "U"
                        }`)
                      }
                    />
                    <span className="text-gray-700 text-sm max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Simple dropdown */}
                  {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/teacher-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {open ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-3 pt-2 pb-4 space-y-2 border-t">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePicture || `/user/${user?._id}/avatar`}
                alt={user?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = `https://via.placeholder.com/40x40/6366f1/ffffff?text=${
                    user?.name?.charAt(0) || "U"
                  }`)
                }
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.name || "Guest"}
                </div>
                <div className="text-xs text-gray-500">
                  {user ? "Member" : "Welcome"}
                </div>
              </div>
            </div>
            <div>
              {user ? (
                <button onClick={handleLogout} className="text-sm text-red-600">
                  Logout
                </button>
              ) : (
                <Link to="/signin" className="text-sm text-indigo-600">
                  Sign in
                </Link>
              )}
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <Link
              to="/teachers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Teachers
            </Link>
            <Link
              to="/rankings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Rankings
            </Link>
            <Link
              to="/add-review"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Add Review
            </Link>
            <Link
              to="/user-profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
