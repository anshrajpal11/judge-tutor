import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [activeTab, setActiveTab] = useState("overview");

  const [teacherData, setTeacherData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // reset to first page when the number of reviews changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [reviews.length]);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/teacher/${teacherId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch teacher: ${res.status}`);
        const data = await res.json();

        // Normalize teacher
        const normalized = {
          id: data._id,
          name: data.name,
          university: data.collageId?.name || "",
          subjects: Array.isArray(data.subjects) ? data.subjects : [],
          experience: data.experience || 0,
          avatar:
            data.avatar ||
            `https://via.placeholder.com/150x150/6366f1/ffffff?text=${
              data.name?.charAt(0) || "T"
            }`,
          bio: data.description || "",
          achievements: Array.isArray(data.achievements)
            ? data.achievements
            : [],
          location: data.location || "",
          email: data.email || "",
          phone: data.phone || "",
        };

        // Normalize reviews from populated review docs
        const normalizedReviews = Array.isArray(data.review)
          ? data.review.map((r) => ({
              id: r._id,
              studentName: r.studentName || "Anonymous",
              rating: r.overallRating || 0,
              date: r.createdAt,
              reviewText: r.comment || "",
              detailedRatings: {
                knowledge: r.knowledgeRating,
                communication: r.communicationRating,
                explanation: r.explanationRating,
                availability: r.availabilityRating,
                grading: r.gradingRating,
                engagement: r.engagementRating,
                preparation: r.preparationRating,
                approachability: r.approachabilityRating,
                feedback: r.feedbackRating,
                overall: r.overallRating,
              },
            }))
          : [];

        // attach server-provided aggregates when available
        normalized.averageRating =
          data.averageRating || normalized.averageRating || 0;
        normalized.categoryAverages = data.categoryAverages || {};
        normalized.totalReviews = data.totalReviews || normalizedReviews.length;

        setTeacherData(normalized);
        setReviews(normalizedReviews);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load teacher");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) fetchTeacher();
  }, [teacherId]);

  // compute a safe avatar src so we don't try to hit the backend with an undefined id
  const avatarSrc =
    teacherData?.avatar ||
    (teacherData?.id ? `${API}/teacher/${teacherData.id}/avatar` : null) ||
    `https://via.placeholder.com/150x150/6366f1/ffffff?text=${
      teacherData?.name?.charAt(0) || "T"
    }`;

  const renderStars = (rating, size = "text-lg") => {
    return (
      <div className="flex items-center space-x-1">
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
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!Array.isArray(reviews) || reviews.length === 0) return distribution;
    reviews.forEach((review) => {
      const r = Math.round(review.rating || 0);
      if (r >= 1 && r <= 5) distribution[r] = (distribution[r] || 0) + 1;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  const getAverageRatingByCategory = () => {
    // prefer server-provided category averages if present
    if (
      teacherData?.categoryAverages &&
      Object.keys(teacherData.categoryAverages).length
    )
      return teacherData.categoryAverages;

    if (!Array.isArray(reviews) || reviews.length === 0) return {};
    const first = reviews.find((r) => r && r.detailedRatings);
    if (!first) return {};
    const categories = Object.keys(first.detailedRatings || {});
    const averages = {};

    categories.forEach((category) => {
      const sum = reviews.reduce(
        (acc, review) => acc + (review.detailedRatings?.[category] || 0),
        0
      );
      averages[category] = Number((sum / reviews.length).toFixed(2));
    });

    return averages;
  };

  const categoryAverages = getAverageRatingByCategory();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-lg text-gray-600">Loading teacher...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-lg text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Rankings
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Teacher Profile
          </h1>
          <p className="text-gray-600">
            Detailed information about {teacherData?.name || ""}
          </p>
        </div>

        {/* Teacher Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <img
                src={avatarSrc}
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/150x150/6366f1/ffffff?text=${
                    teacherData?.name?.charAt(0) || "T"
                  }`;
                }}
                alt={teacherData?.name || "Teacher"}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center lg:text-left">
                {teacherData.name}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-4 text-center lg:text-left">
                {teacherData.university}
                {teacherData.location ? ` • ${teacherData.location}` : ""}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(teacherData?.subjects || []).map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {teacherData?.experience || 0} years experience
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {teacherData.totalReviews} reviews
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{teacherData.location}</span>
                </div>
              </div>

              {/* Contact email moved here (was previously in Contact tab) */}
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {teacherData.email || "Not provided"}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {teacherData?.bio}
              </p>
            </div>

            <div className="text-center lg:text-right flex-shrink-0 w-full lg:w-40">
              <div className="text-3xl font-bold text-gray-900 mb-2 truncate">
                {teacherData.averageRating}
              </div>
              {/* use slightly smaller stars in header so they don't overflow */}
              {renderStars(teacherData.averageRating, "text-xl")}
              <p className="text-sm text-gray-500 mt-2">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-4 md:px-6 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews ({teacherData.totalReviews})
              </button>
              {/* Contact & Info tab removed - contact info moved into main profile card */}
            </nav>
          </div>

          <div className="p-4 md:p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Rating Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rating Distribution
                  </h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-2">
                          {rating}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${
                                (distribution[rating] / (reviews.length || 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {distribution[rating]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Ratings (moved below distribution) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Average Ratings by Category
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(categoryAverages).map(
                      ([category, rating]) => {
                        const label = category
                          .replace(/([A-Z])/g, " $1")
                          .replace(/_/g, " ")
                          .trim();
                        return (
                          <div
                            key={category}
                            className="bg-gray-50 p-3 rounded-lg flex items-center justify-between flex-shrink"
                          >
                            <div>
                              <div className="text-sm font-medium text-gray-700 capitalize">
                                {label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {rating ? `${rating} / 5` : "—"}
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              {renderStars(
                                parseFloat(rating) || 0,
                                "text-base"
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacherData.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {(() => {
                  const totalPages = Math.max(
                    1,
                    Math.ceil(reviews.length / reviewsPerPage)
                  );
                  // clamp currentPage
                  const page = Math.min(Math.max(1, currentPage), totalPages);
                  const start = (page - 1) * reviewsPerPage;
                  const end = start + reviewsPerPage;
                  const pageReviews = reviews.slice(start, end);

                  return (
                    <>
                      {pageReviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {review.studentName}
                              </h3>
                              <p className="text-gray-600">
                                {formatDate(review.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              {renderStars(review.rating)}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-700">{review.reviewText}</p>
                          </div>

                          {/* Detailed Ratings */}
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Detailed Ratings:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(review.detailedRatings).map(
                                ([key, rating]) => {
                                  const label = key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/_/g, " ")
                                    .trim();
                                  return (
                                    <div
                                      key={key}
                                      className="bg-gray-50 p-3 rounded-lg flex items-center justify-between flex-shrink"
                                    >
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">
                                          {label.charAt(0).toUpperCase() +
                                            label.slice(1)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {rating ? `${rating} / 5` : "—"}
                                        </div>
                                      </div>
                                      <div className="ml-4 flex-shrink-0">
                                        {renderStars(rating || 0, "text-base")}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination controls */}
                      {reviews.length > reviewsPerPage && (
                        <div className="flex items-center justify-between pt-4">
                          <div className="text-sm text-gray-600">
                            Showing{" "}
                            {Math.min(
                              reviewsPerPage,
                              reviews.length - (page - 1) * reviewsPerPage
                            )}{" "}
                            of {reviews.length} reviews
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={page === 1}
                              className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
                            >
                              Prev
                            </button>
                            <div className="text-sm text-gray-700">
                              Page {page} of {totalPages}
                            </div>
                            <button
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
                              }
                              disabled={page === totalPages}
                              className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Contact tab removed - contact info displayed in main card */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherProfile;
