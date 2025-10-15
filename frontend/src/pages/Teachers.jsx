import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import hv from "../assets/hv.png";
import {
  Search,
  MapPin,
  Award,
  Clock,
  Star,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

const Teachers = () => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const [colleges, setColleges] = useState(["All Universities"]);

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch teachers from backend
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/teacher/all`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch teachers: ${res.status}`);
        const data = await res.json();

        // normalize teachers for UI
        const normalized = data.map((t) => {
          const reviews = Array.isArray(t.review) ? t.review : [];
          const totalRatings = reviews.length;
          // prefer server-provided aggregate if available, otherwise compute from reviews
          const serverAvg =
            t.averageRating !== undefined && t.averageRating !== null
              ? Number(t.averageRating)
              : null;
          const avgRating =
            serverAvg && !Number.isNaN(serverAvg)
              ? Number(serverAvg.toFixed(1))
              : totalRatings > 0
              ? Number(
                  (
                    reviews.reduce((s, r) => s + (r.overallRating || 0), 0) /
                    totalRatings
                  ).toFixed(1)
                )
              : 0;

          const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
          return {
            id: t._id,
            name: t.name,
            university: t.collageId?.name || "",
            location: t.location || t.collageId?.address || "",
            universityLogo: "",
            experience: t.experience ? `${t.experience} years` : "",
            rating: avgRating,
            totalRatings,
            subjects:
              Array.isArray(t.subjects) && t.subjects.length > 0
                ? t.subjects
                : t.subject
                ? [t.subject]
                : [],
            img: t.avatar ? t.avatar : `${API}/teacher/${t._id || t.id}/avatar`,
            bio: t.description || t.subject || "",
            achievements: Array.isArray(t.achievements) ? t.achievements : [],
            availability: "Available",
          };
        });

        setTeachers(normalized);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
    // fetch colleges for filter
    const fetchColleges = async () => {
      try {
        const res = await fetch(`${API}/college/all`);
        if (!res.ok) throw new Error("Failed to load colleges");
        const data = await res.json();
        if (Array.isArray(data)) {
          setColleges(["All Universities", ...data.map((c) => c.name)]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchColleges();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      teacher.university.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUniversity =
      selectedUniversity === "" ||
      selectedUniversity === "All Universities" ||
      teacher.university === selectedUniversity;

    return matchesSearch && matchesUniversity;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gray-200 text-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')]"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="text-black text-sm font-medium">
              Discover Excellence in Education
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 tracking-tight">
            Find Your Perfect Mentor
          </h1>
          <p className="text-lg md:text-xl text-blue/90 max-w-3xl mx-auto leading-relaxed">
            Connect with exceptional educators from top universities and unlock
            your full academic potential
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        {/* Search and Filter Card */}
        <div className="relative bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 mb-12 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl pointer-events-none"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by name, subject, or university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* University Filter */}
              <div className="md:w-72">
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none text-foreground cursor-pointer"
                  >
                    {colleges.map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredTeachers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {teachers.length}
                </span>{" "}
                educators
              </span>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">
              Loading exceptional educators...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Gradient Accent on Hover */}
              <div className="absolute inset-0 opacity-0 pointer-events-none" />

              {/* Card Content */}
              <div className="relative p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                      <img
                        src={
                          teacher.avatar
                            ? teacher.avatar
                            : `${API}/teacher/${teacher.id}/avatar`
                        }
                        onError={(e) => (e.currentTarget.src = teacher.img)}
                        alt={teacher.name}
                        className="relative w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-primary/30 shadow-md ring-4 ring-primary/10"
                      />
                      {teacher.availability === "Available" && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-card shadow-sm">
                          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-base md:text-lg leading-tight mb-1 group-hover:text-primary transition-colors truncate">
                        {teacher.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <p className="truncate">{teacher.university}</p>
                      </div>
                      {teacher.location && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate hidden sm:block">
                          {teacher.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex-shrink-0 ml-2">
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2.5 py-1 rounded-lg shadow-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">
                          {teacher.rating > 0 ? teacher.rating : "—"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {teacher.totalRatings}{" "}
                        {teacher.totalRatings === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 md:line-clamp-2 leading-relaxed">
                  {teacher.bio}
                </p>

                {/* Experience & Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{teacher.experience}</span>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      teacher.availability === "Available"
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        teacher.availability === "Available"
                          ? "bg-accent"
                          : "bg-destructive"
                      }`}
                    ></span>
                    {teacher.availability}
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {teacher.subjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-muted/50 border border-border text-foreground text-xs rounded-lg font-medium hover:bg-muted transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                  {teacher.subjects.length > 3 && (
                    <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs rounded-lg font-semibold">
                      +{teacher.subjects.length - 3}
                    </span>
                  )}
                </div>

                {/* Achievements */}
                {teacher.achievements?.length > 0 && (
                  <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <Award className="w-4 h-4 text-secondary" />
                      <span>Key Achievements</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      {teacher.achievements
                        .slice(0, 2)
                        .map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <Link to={`/teacher/${teacher.id}`} className="block">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group/btn">
                    <span>View Full Profile</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {!loading && filteredTeachers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No educators found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search criteria or filters to discover more
              exceptional teachers.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Teachers;
