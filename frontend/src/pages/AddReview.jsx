import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const AddReview = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [reviews, setReviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetched from API
  const [universities, setUniversities] = useState([]);
  const [teachersByUniversity, setTeachersByUniversity] = useState({});

  const reviewQuestions = [
    "How would you rate the teacher's knowledge of the subject?",
    "How effective is the teacher's communication style?",
    "How well does the teacher explain complex concepts?",
    "How available is the teacher for questions and help?",
    "How fair and consistent is the teacher's grading?",
    "How engaging and interactive are the classes?",
    "How well does the teacher prepare for lectures?",
    "How approachable and friendly is the teacher?",
    "How well does the teacher provide feedback?",
    "Overall, how satisfied are you with this teacher?",
  ];

  const handleUniversityChange = (university) => {
    setSelectedUniversity(university);
    setSelectedTeacher("");
    setReviews({});
  };

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${API}/teacher/all`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch teachers");
        const data = await res.json();

        // group by university (collageId.name)
        const byUniv = {};
        data.forEach((t) => {
          const un = t.collageId?.name || "Unknown University";
          if (!byUniv[un]) byUniv[un] = [];
          byUniv[un].push(t);
        });
        setTeachersByUniversity(byUniv);
        // only update universities list from teachers if there are any teachers
        const keys = Object.keys(byUniv);
        if (keys.length > 0) setUniversities(keys);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeachers();
  }, []);

  // fetch colleges independently so dropdown is available even when no teachers exist
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchColleges = async () => {
      try {
        const res = await fetch(`${API}/college/all`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // do not overwrite if teachers fetch already populated universities with teacher-only list
          setUniversities((prev) =>
            prev && prev.length > 0 ? prev : data.map((c) => c.name)
          );
        }
      } catch (e) {
        console.error("Failed to fetch colleges", e.message);
      }
    };
    fetchColleges();
  }, []);

  // check if user is logged in
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) return setCurrentUser(null);
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    fetchMe();
  }, []);

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
    setReviews({});
  };

  const handleRatingChange = (questionIndex, rating) => {
    setReviews((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        rating: rating,
      },
    }));
  };

  const handleReviewTextChange = (questionIndex, text) => {
    setReviews((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        text: text,
      },
    }));
  };

  const renderStars = (questionIndex, currentRating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(questionIndex, star)}
            className={`text-2xl ${
              star <= currentRating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
      if (!selectedTeacher) throw new Error("Please select a teacher");
      if (!currentUser)
        throw new Error("You must be signed in to submit a review");

      // Map reviews object to schema fields
      const payload = {
        overallRating: reviews[9]?.rating || 0,
        knowledgeRating: reviews[0]?.rating || 0,
        communicationRating: reviews[1]?.rating || 0,
        explanationRating: reviews[2]?.rating || 0,
        availabilityRating: reviews[3]?.rating || 0,
        gradingRating: reviews[4]?.rating || 0,
        engagementRating: reviews[5]?.rating || 0,
        preparationRating: reviews[6]?.rating || 0,
        approachabilityRating: reviews[7]?.rating || 0,
        feedbackRating: reviews[8]?.rating || 0,
        comment: reviews[9]?.text || "",
        universityId: null, // optional, backend will fall back to teacher.collageId
      };

      const res = await fetch(`${API}/teacher/${selectedTeacher}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      alert("Review submitted successfully!");
      // redirect to teacher profile
      window.location.href = `/teacher/${selectedTeacher}`;
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeacherData = selectedTeacher
    ? (teachersByUniversity[selectedUniversity] || []).find(
        (t) => t._id.toString() === selectedTeacher
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add a Review
          </h1>
          <p className="text-gray-600">
            Share your experience and help other students make informed
            decisions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* University Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step 1: Select University
            </h2>
            <select
              value={selectedUniversity}
              onChange={(e) => handleUniversityChange(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="">Choose a university...</option>
              {universities.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Selection */}
          {selectedUniversity && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 2: Select Teacher
              </h2>
              <select
                value={selectedTeacher}
                onChange={(e) => handleTeacherChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Choose a teacher...</option>
                {(teachersByUniversity[selectedUniversity] || []).map(
                  (teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} - {(teacher.subjects || []).join(", ")}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Review Form */}
          {selectedTeacher && selectedTeacherData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 3: Write Your Review
              </h2>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">
                  {selectedTeacherData.name}
                </h3>
                <p className="text-sm text-gray-600">{selectedUniversity}</p>
                <p className="text-sm text-gray-600">
                  Subjects: {selectedTeacherData.subjects.join(", ")}
                </p>
              </div>

              <div className="space-y-8">
                {reviewQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        {index + 1}. {question}
                      </h3>

                      {/* Star Rating */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating (1-5 stars)
                        </label>
                        {renderStars(index, reviews[index]?.rating || 0)}
                        {reviews[index]?.rating && (
                          <p className="text-sm text-gray-500 mt-1">
                            {reviews[index].rating} star
                            {reviews[index].rating !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>

                      {/* Text Review */}
                      <div>
                        <label
                          htmlFor={`review-${index}`}
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Your detailed review (optional)
                        </label>
                        <textarea
                          id={`review-${index}`}
                          rows={3}
                          value={reviews[index]?.text || ""}
                          onChange={(e) =>
                            handleReviewTextChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Share your thoughts about this aspect..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting Review..." : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddReview;
