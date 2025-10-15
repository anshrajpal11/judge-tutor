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
          <Link to={"/"} className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div>
                <div className="text-2xl font-semibold text-gray-800">
                  Judge<span className="text-gray-400">Tutor</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/teachers"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Teachers
            </Link>
            <Link
              to="/rankings"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Rankings
            </Link>
            <Link
              to="/add-review"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Add Review
            </Link>
            <Link
              to="/user-profile"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Profile
            </Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePicture || `/user/${user._id}/avatar`}
                  alt={user.name}
                  className="avatar-sm"
                  onError={(e) =>
                    (e.currentTarget.src = `https://via.placeholder.com/40x40/6366f1/ffffff?text=${
                      user.name?.charAt(0) || "U"
                    }`)
                  }
                />
                <span className="text-gray-700 max-w-[140px] truncate">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-400 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors inline-block"
              >
                Sign in
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t">
          <div className="flex items-center justify-between px-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePicture || `/user/${user._id}/avatar`}
                  alt={user.name}
                  className="avatar-sm"
                  onError={(e) =>
                    (e.currentTarget.src = `https://via.placeholder.com/40x40/6366f1/ffffff?text=${
                      user.name?.charAt(0) || "U"
                    }`)
                  }
                />
                <div className="text-sm font-medium truncate">{user.name}</div>
              </div>
            ) : (
              <div />
            )}
          </div>
          <Link
            to="/teachers"
            className="block text-gray-700 px-2 py-2 rounded hover:bg-gray-50"
          >
            Teachers
          </Link>
          <Link
            to="/rankings"
            className="block text-gray-700 px-2 py-2 rounded hover:bg-gray-50"
          >
            Rankings
          </Link>
          <Link
            to="/add-review"
            className="block text-gray-700 px-2 py-2 rounded hover:bg-gray-50"
          >
            Add Review
          </Link>
          <Link
            to="/user-profile"
            className="block text-gray-700 px-2 py-2 rounded hover:bg-gray-50"
          >
            Profile
          </Link>
          <div className="pt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-500 block text-center"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="w-full bg-gray-900 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-800 block text-center"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
