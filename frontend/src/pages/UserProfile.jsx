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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="mt-2 text-gray-700">
            College: {user.collageId?.name || "N/A"}
          </p>
          <p className="text-gray-600">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Your Reviews</h3>
          {Array.isArray(user.reviews) && user.reviews.length > 0 ? (
            <div className="space-y-4">
              {user.reviews.map((r) => (
                <div key={r._id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {r.teacherId?.name || "Unknown Teacher"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {r.teacherId?.collageId?.name || ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{r.overallRating}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {r.comment && (
                    <p className="mt-3 text-gray-700">{r.comment}</p>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Category ratings
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                          className="bg-gray-50 p-3 rounded-lg flex items-center justify-between flex-shrink"
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {r[key] ? `${r[key]} / 5` : "—"}
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {renderStars(r[key] || 0, "text-base")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">
              You haven't added any reviews yet.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
