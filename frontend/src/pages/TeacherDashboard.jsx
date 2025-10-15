import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock teacher data
  const teacherData = {
    name: "Dr. Harshvardhan",
    university: "Chitkara University",
    subjects: ["Computer Science", "Data Structures", "Algorithms"],
    experience: 8,
    totalReviews: 156,
    averageRating: 4.8,
    avatar: "https://via.placeholder.com/150x150/6366f1/ffffff?text=DH",
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      studentName: "John Doe",
      rating: 5,
      date: "2024-01-15",
      reviewText:
        "Excellent teacher with deep knowledge of computer science concepts. Very clear explanations and always available for help.",
      detailedRatings: {
        knowledge: 5,
        communication: 5,
        explanation: 5,
        availability: 4,
        grading: 5,
        engagement: 5,
        preparation: 5,
        approachability: 5,
        feedback: 5,
        overall: 5,
      },
    },
    {
      id: 2,
      studentName: "Sarah Wilson",
      rating: 4,
      date: "2024-01-12",
      reviewText:
        "Great teacher! The data structures course was very well structured. Sometimes explanations could be clearer, but overall excellent.",
      detailedRatings: {
        knowledge: 5,
        communication: 4,
        explanation: 4,
        availability: 5,
        grading: 4,
        engagement: 4,
        preparation: 5,
        approachability: 4,
        feedback: 4,
        overall: 4,
      },
    },
    {
      id: 3,
      studentName: "Mike Chen",
      rating: 5,
      date: "2024-01-10",
      reviewText:
        "Dr. Harshvardhan is an outstanding professor. His algorithms course was challenging but incredibly rewarding. Highly recommend!",
      detailedRatings: {
        knowledge: 5,
        communication: 5,
        explanation: 5,
        availability: 5,
        grading: 5,
        engagement: 5,
        preparation: 5,
        approachability: 5,
        feedback: 5,
        overall: 5,
      },
    },
    {
      id: 4,
      studentName: "Emily Rodriguez",
      rating: 4,
      date: "2024-01-08",
      reviewText:
        "Very knowledgeable teacher. The course material is comprehensive and well-organized. Office hours are very helpful.",
      detailedRatings: {
        knowledge: 5,
        communication: 4,
        explanation: 4,
        availability: 5,
        grading: 4,
        engagement: 4,
        preparation: 5,
        approachability: 4,
        feedback: 4,
        overall: 4,
      },
    },
  ];

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
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your performance and student feedback.
          </p>
        </div>

        {/* Teacher Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={teacherData.avatar}
              alt={teacherData.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {teacherData.name}
              </h2>
              <p className="text-gray-600 mb-2">{teacherData.university}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {teacherData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
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
                  <span>{teacherData.experience} years experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
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
                  <span>{teacherData.totalReviews} reviews</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {teacherData.averageRating}
              </div>
              {renderStars(teacherData.averageRating, "text-2xl")}
              <p className="text-sm text-gray-500 mt-2">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
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
                All Reviews ({teacherData.totalReviews})
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Rating Distribution */}
                <div className="bg-gray-50 rounded-lg p-6">
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
                                (distribution[rating] / reviews.length) * 100
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

                {/* Recent Reviews */}
                <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Reviews
                  </h3>
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div
                        key={review.id}
                        className="border-l-4 border-gray-300 pl-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {review.studentName}
                          </span>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating, "text-sm")}
                            <span className="text-xs text-gray-500">
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {review.reviewText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.map((review) => (
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
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(review.detailedRatings).map(
                          ([key, rating]) => (
                            <div key={key} className="text-center">
                              <div className="text-sm text-gray-600 mb-1">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </div>
                              {renderStars(rating, "text-sm")}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Average Ratings by Category */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Average Ratings by Category
                  </h3>
                  <div className="space-y-3">
                    {Object.keys(reviews[0].detailedRatings).map((category) => {
                      const avgRating =
                        reviews.reduce(
                          (sum, review) =>
                            sum + review.detailedRatings[category],
                          0
                        ) / reviews.length;
                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 capitalize">
                            {category.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          {renderStars(avgRating, "text-sm")}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rating Trend
                  </h3>
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">
                      Chart coming soon
                    </p>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Summary Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Reviews:
                      </span>
                      <span className="font-medium">
                        {teacherData.totalReviews}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Average Rating:
                      </span>
                      <span className="font-medium">
                        {teacherData.averageRating}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Highest Rating:
                      </span>
                      <span className="font-medium">5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Lowest Rating:
                      </span>
                      <span className="font-medium">4.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        5-Star Reviews:
                      </span>
                      <span className="font-medium">{distribution[5]}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;


