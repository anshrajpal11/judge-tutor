import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderStars = (rating, size = "text-sm") => {
    return (
      <div className="flex items-center justify-end space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} ${
              star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-xs text-gray-600">{rating}</span>
      </div>
    );
  };

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchMe = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
        <Footer />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600">
              Manage your account and view your review history
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">College</div>
                      <div className="text-sm text-gray-600">{user.collageId?.name || "Not specified"}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Member Since</div>
                      <div className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Your Reviews</h3>
              <div className="text-sm text-gray-500">
                {Array.isArray(user.reviews) ? user.reviews.length : 0} reviews
              </div>
            </div>

            {Array.isArray(user.reviews) && user.reviews.length > 0 ? (
              <div className="space-y-6">
                {user.reviews.map((r) => (
                  <div key={r._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {r.teacherId?.name?.charAt(0)?.toUpperCase() || "T"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {r.teacherId?.name || "Unknown Teacher"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {r.teacherId?.collageId?.name || "Institution"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{r.overallRating}</div>
                          <div className="flex items-center justify-center mb-1">
                            {renderStars(r.overallRating, "text-lg")}
                          </div>
                          <div className="text-xs text-gray-500">Overall Rating</div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(r.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {r.comment && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 italic">"{r.comment}"</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Detailed Ratings
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          ["knowledgeRating", "Knowledge"],
                          ["communicationRating", "Communication"],
                          ["explanationRating", "Explanation"],
                          ["availabilityRating", "Availability"],
                          ["gradingRating", "Grading"],
                          ["engagementRating", "Engagement"],
                          ["preparationRating", "Preparation"],
                          ["approachabilityRating", "Approachability"],
                          ["feedbackRating", "Feedback"],
                        ].map(([key, label]) => (
                          <div
                            key={key}
                            className="bg-blue-50 p-3 rounded-lg flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {label}
                              </div>
                              <div className="text-xs text-gray-600">
                                {r[key] ? `${r[key]} / 5` : "Not rated"}
                              </div>
                            </div>
                            <div className="ml-3">
                              {renderStars(r[key] || 0, "text-sm")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-4">You haven't written any teacher reviews yet.</p>
                <a
                  href="/teachers"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse Teachers
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
