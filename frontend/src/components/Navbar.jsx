import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userButtonRef = useRef(null);
  const userDropdownRef = useRef(null);

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

 
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setUserOpen(false);
        setMobileOpen(false);
      }
    }

    function handleClick(e) {
      if (
        userOpen &&
        userDropdownRef.current &&
        userButtonRef.current &&
        !userDropdownRef.current.contains(e.target) &&
        !userButtonRef.current.contains(e.target)
      ) {
        setUserOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [userOpen]);

  const handleLogout = async () => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      
    }
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-sm">
              <span className="text-white font-bold text-lg">JT</span>
            </div>
            <div className="ml-3">
              <div className="text-xl font-bold text-gray-900 leading-tight">
                Judge<span className="text-gray-500 font-semibold">Tutor</span>
              </div>
              <div className="text-xs text-gray-500 -mt-0.5">Find & rate teachers</div>
            </div>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex md:space-x-6 md:items-center">
            <Link
              to="/teachers"
              className="nav-link text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Teachers
            </Link>
            <Link
              to="/rankings"
              className="nav-link text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Rankings
            </Link>
            <Link
              to="/add-review"
              className="nav-link text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Add Review
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop auth area */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="flex items-center space-x-2 px-3 py-1.5">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Loading Profile...</span>
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    ref={userButtonRef}
                    aria-haspopup="true"
                    aria-expanded={userOpen}
                    onClick={() => setUserOpen((s) => !s)}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <img
                      src={user.profilePicture || `/user/${user._id}/avatar`}
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
                  {userOpen && (
                    <div
                      ref={userDropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
                    >
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
                onClick={() => setMobileOpen((s) => !s)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {mobileOpen ? (
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
      {mobileOpen && (
        <div className="md:hidden px-3 pt-2 pb-4 space-y-2 border-t">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Loading Profile...</div>
                    <div className="text-xs text-gray-500">Checking status</div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={user?.profilePicture || `https://via.placeholder.com/40x40/6366f1/ffffff?text=${user?.name?.charAt(0) || "U"}`}
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
                </>
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="text-sm text-gray-500">...</div>
              ) : user ? (
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
