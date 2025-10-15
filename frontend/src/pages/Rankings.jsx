import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import hv from "../assets/hv.png";

const Rankings = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // rating, experience
  const [sortOrder, setSortOrder] = useState("desc"); // desc, asc

  const [colleges, setColleges] = useState(["All Universities"]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchColleges = async () => {
      try {
        const res = await fetch(`${API}/college/all`);
        if (!res.ok) throw new Error("Failed to load colleges");
        const data = await res.json();
        if (Array.isArray(data))
          setColleges(["All Universities", ...data.map((c) => c.name)]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchColleges();
  }, []);

  const teachersData = {
    "Chitkara University": [
      {
        id: 1,
        name: "Dr. Harshvardhan",
        university: "Chitkara University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 8,
        rating: 4.8,
        totalRatings: 156,
        subjects: ["Computer Science", "Data Structures", "Algorithms"],
        img: hv,
        bio: "Expert in computer science with extensive research experience in machine learning and data structures.",
        achievements: [
          "Best Teacher Award 2023",
          "Published 25+ Research Papers",
        ],
      },
      {
        id: 2,
        name: "Prof. Rajesh Kumar",
        university: "Chitkara University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 12,
        rating: 4.6,
        totalRatings: 134,
        subjects: ["Mathematics", "Statistics"],
        img: hv,
        bio: "Professor of Mathematics with specialization in applied mathematics and statistical analysis.",
        achievements: ["Mathematics Excellence Award", "Published 15+ Papers"],
      },
      {
        id: 3,
        name: "Dr. Priya Sharma",
        university: "Chitkara University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 6,
        rating: 4.4,
        totalRatings: 89,
        subjects: ["Physics", "Research Methods"],
        img: hv,
        bio: "Assistant Professor of Physics with expertise in quantum mechanics and research methodology.",
        achievements: ["Young Researcher Award", "Published 10+ Papers"],
      },
    ],
    "Stanford University": [
      {
        id: 4,
        name: "Dr. Sarah Johnson",
        university: "Stanford University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 12,
        rating: 4.9,
        totalRatings: 203,
        subjects: ["Mathematics", "Statistics", "Machine Learning"],
        img: hv,
        bio: "Professor of Mathematics with specialization in statistical modeling and machine learning applications.",
        achievements: ["Nobel Prize Nominee 2022", "IEEE Fellow"],
      },
      {
        id: 5,
        name: "Prof. John Smith",
        university: "Stanford University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 15,
        rating: 4.7,
        totalRatings: 178,
        subjects: ["Computer Science", "AI"],
        img: hv,
        bio: "Professor of Computer Science with expertise in artificial intelligence and machine learning.",
        achievements: ["Turing Award Winner", "Published 50+ Papers"],
      },
    ],
    MIT: [
      {
        id: 6,
        name: "Prof. Michael Chen",
        university: "MIT",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 15,
        rating: 4.7,
        totalRatings: 189,
        subjects: ["Physics", "Quantum Mechanics", "Research Methods"],
        img: hv,
        bio: "Distinguished Professor of Physics, leading researcher in quantum computing and theoretical physics.",
        achievements: ["MIT Excellence Award", "Author of 40+ Papers"],
      },
      {
        id: 7,
        name: "Dr. Lisa Wang",
        university: "MIT",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 10,
        rating: 4.5,
        totalRatings: 145,
        subjects: ["Engineering", "Technology"],
        img: hv,
        bio: "Associate Professor of Engineering with expertise in advanced technology and innovation.",
        achievements: ["Engineering Innovation Award", "Published 20+ Papers"],
      },
    ],
    "Harvard University": [
      {
        id: 8,
        name: "Dr. Emily Rodriguez",
        university: "Harvard University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 10,
        rating: 4.9,
        totalRatings: 167,
        subjects: ["Psychology", "Cognitive Science", "Research Design"],
        img: hv,
        bio: "Associate Professor specializing in cognitive psychology and behavioral research methodologies.",
        achievements: [
          "Harvard Teaching Excellence",
          "APA Distinguished Award",
        ],
      },
      {
        id: 9,
        name: "Prof. David Lee",
        university: "Harvard University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 18,
        rating: 4.6,
        totalRatings: 156,
        subjects: ["Business", "Economics"],
        img: hv,
        bio: "Professor of Business Administration with expertise in economic theory and business strategy.",
        achievements: ["Harvard Business Excellence", "Published 30+ Papers"],
      },
    ],
    "University of California": [
      {
        id: 10,
        name: "Prof. David Kim",
        university: "University of California",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 7,
        rating: 4.6,
        totalRatings: 134,
        subjects: ["Business", "Economics", "Entrepreneurship"],
        img: hv,
        bio: "Professor of Business with expertise in economic theory and startup ecosystem development.",
        achievements: ["UC Innovation Award", "Forbes 30 Under 30"],
      },
    ],
    "Oxford University": [
      {
        id: 11,
        name: "Dr. Lisa Thompson",
        university: "Oxford University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 20,
        rating: 4.8,
        totalRatings: 245,
        subjects: ["Literature", "Creative Writing", "History"],
        img: hv,
        bio: "Senior Lecturer in English Literature with extensive experience in creative writing and literary analysis.",
        achievements: ["Oxford Distinguished Teaching", "Booker Prize Judge"],
      },
    ],
    "Cambridge University": [
      {
        id: 12,
        name: "Dr. James Wilson",
        university: "Cambridge University",
        universityLogo:
          "https://uploads.sarvgyan.com/2014/04/Chitkara-University-Patiala.jpg",
        experience: 14,
        rating: 4.5,
        totalRatings: 167,
        subjects: ["Chemistry", "Biochemistry"],
        img: hv,
        bio: "Professor of Chemistry with expertise in biochemistry and molecular research.",
        achievements: ["Cambridge Research Excellence", "Published 35+ Papers"],
      },
    ],
  };
  // fetched teachers (from backend) will be used when available
  const [fetchedTeachers, setFetchedTeachers] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API}/teacher/all`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setFetchedTeachers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Failed to fetch teachers", e.message);
      }
    };
    fetchAll();
  }, []);

  // normalize source: prefer fetchedTeachers when it's not null/undefined
  // if backend returns an empty array, respect that (show "No teachers found").
  const allSourceTeachers =
    typeof fetchedTeachers === "undefined" || fetchedTeachers === null
      ? Object.values(teachersData).flat()
      : fetchedTeachers;

  // normalize shape for UI usage
  const normalizedTeachers = allSourceTeachers.map((t) => ({
    id: t._id || t.id,
    name: t.name,
    university: (t.collageId && t.collageId.name) || t.university || "",
    universityLogo: (t.collageId && t.collageId.logo) || t.universityLogo || "",
    experience: t.experience || 0,
    rating: Number(t.averageRating ?? t.rating ?? 0),
    totalRatings: t.totalReviews || t.totalRatings || 0,
    subjects: t.subjects || [],
    // Prefer an inline avatar (data URI) from the API, otherwise use the avatar endpoint, otherwise fallback to placeholder
    img: t.avatar
      ? t.avatar
      : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/teacher/${
          t._id || t.id
        }/avatar` ||
        t.img ||
        hv,
    bio: t.description || t.bio || "",
    achievements: t.achievements || [],
  }));

  const currentTeachers = selectedUniversity
    ? normalizedTeachers.filter(
        (teacher) => teacher.university === selectedUniversity
      )
    : normalizedTeachers;

  const filteredAndSortedTeachers = currentTeachers
    .filter((teacher) => {
      const q = searchTerm.toLowerCase();
      return (
        teacher.name.toLowerCase().includes(q) ||
        (teacher.subjects || []).some((s) => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "rating") {
        comparison = a.rating - b.rating;
      } else if (sortBy === "experience") {
        comparison = a.experience - b.experience;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} (
          {filteredAndSortedTeachers.find((t) => t.rating === rating)
            ?.totalRatings || 0}{" "}
          reviews)
        </span>
      </div>
    );
  };

  return (
    // make this a column flex container so Footer can sit at the bottom when content is short
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* main content should grow to push footer down */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teacher Rankings
            </h1>
            <p className="text-gray-600">
              Discover the top-rated teachers at your university and compare
              their performance.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* University Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select University
                </label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Choose a university...</option>
                  {colleges.map((university) => (
                    <option key={university} value={university}>
                      {university}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Teachers
                </label>
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            {selectedUniversity && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredAndSortedTeachers.length} teachers from{" "}
                {selectedUniversity}
              </div>
            )}
          </div>

          {/* Rankings */}
          <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-2">
              Showing {filteredAndSortedTeachers.length} teachers
              {selectedUniversity ? ` from ${selectedUniversity}` : ""}
            </div>
            {filteredAndSortedTeachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={teacher.img}
                          alt={teacher.name}
                          className="w-16 h-16 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {teacher.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <img
                              src={teacher.universityLogo}
                              alt={teacher.university}
                              className="w-5 h-5 rounded"
                            />
                            <span className="text-gray-600">
                              {teacher.university}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {teacher.subjects.map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating and Stats */}
                    <div className="text-right">
                      <div className="mb-2">{renderStars(teacher.rating)}</div>
                      <div className="text-sm text-gray-600 space-y-1">
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
                          <span>{teacher.experience} years experience</span>
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
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                          <span>
                            {teacher.achievements.length} achievements
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">{teacher.bio}</p>
                  </div>

                  {/* Achievements */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Key Achievements:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.achievements.map((achievement, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link to={`/teacher-profile/${teacher.id}`}>
                      <Button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* No Results */}
            {filteredAndSortedTeachers.length === 0 && (
              <div className="text-center py-12">
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No teachers found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rankings;
