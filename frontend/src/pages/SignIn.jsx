import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const SignIn = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student form data
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    university: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    isSignUp: false,
  });

  // Teacher form data
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    university: "",
    subjects: "",
    experience: "",
    achievements: "",
    description: "",
    email: "",
    password: "",
    isSignUp: true,
  });

  const [colleges, setColleges] = useState([]);
  const [studentProfileFile, setStudentProfileFile] = useState(null);
  const [teacherProfileFile, setTeacherProfileFile] = useState(null);
  const [studentPreview, setStudentPreview] = useState(null);
  const [teacherPreview, setTeacherPreview] = useState(null);

  // fetch colleges from backend for dropdowns
  React.useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchColleges = async () => {
      try {
        const res = await fetch(`${API}/college/all`);
        if (!res.ok) throw new Error("Failed to fetch colleges");
        const data = await res.json();
        setColleges(Array.isArray(data) ? data.map((c) => c.name) : []);
      } catch (err) {
        console.error(err);
        setColleges([]);
      }
    };
    fetchColleges();
  }, []);

  const subjectOptions = [
    "Computer Science",
    "Data Structures",
    "Algorithms",
    "Mathematics",
    "Statistics",
    "Machine Learning",
    "Physics",
    "Quantum Mechanics",
    "Research Methods",
    "Psychology",
    "Cognitive Science",
    "Research Design",
    "Business",
    "Economics",
    "Entrepreneurship",
    "Literature",
    "Creative Writing",
    "History",
    "Chemistry",
    "Biochemistry",
    "Engineering",
    "Technology",
    "AI",
    "Artificial Intelligence",
  ];

  const handleStudentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStudentFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setStudentProfileFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setStudentPreview(url);
    } else setStudentPreview(null);
  };

  const handleTeacherInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeacherFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setTeacherProfileFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setTeacherPreview(url);
    } else setTeacherPreview(null);
  };

  // cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      if (studentPreview) URL.revokeObjectURL(studentPreview);
      if (teacherPreview) URL.revokeObjectURL(teacherPreview);
    };
  }, [studentPreview, teacherPreview]);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
      if (studentForm.isSignUp) {
        // register student using multipart/form-data to include optional profile picture
        const formData = new FormData();
        formData.append("name", studentForm.fullName);
        formData.append("email", studentForm.email);
        formData.append("password", studentForm.password);
        formData.append("collegeName", studentForm.university);
        if (studentProfileFile)
          formData.append("profilePicture", studentProfileFile);

        const res = await fetch(`${API}/user/register`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        // parse response safely (server may return HTML on error pages)
        let data;
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          const preview =
            text && text.length > 1000 ? text.slice(0, 1000) + "..." : text;
          data = {
            message: `Non-JSON response (status ${res.status}): ${preview}`,
          };
        }
        if (!res.ok) throw new Error(data.message || "Registration failed");
        alert("Student account created! Please sign in.");
        setStudentForm((prev) => ({ ...prev, isSignUp: false }));
      } else {
        // login student
        const payload = {
          email: studentForm.email,
          password: studentForm.password,
        };
        const res = await fetch(`${API}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        // verify /me
        const meRes = await fetch(`${API}/user/me`, { credentials: "include" });
        if (meRes.ok) {
          navigate("/");
        } else {
          alert(
            "Login succeeded but /me check failed. Check cookies and backend."
          );
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Authentication error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      if (teacherForm.isSignUp) {
        // send multipart FormData so profile picture can be uploaded
        const formData = new FormData();
        formData.append("name", teacherForm.name);
        formData.append("email", teacherForm.email);
        formData.append("password", teacherForm.password);
        formData.append("collageName", teacherForm.university);
        const subjectsStr = (teacherForm.subjects || "")
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .join(",");
        formData.append("subjects", subjectsStr);
        formData.append("description", teacherForm.description || "");
        formData.append("achievements", teacherForm.achievements || "");
        formData.append(
          "experience",
          String(Number(teacherForm.experience) || 0)
        );
        if (teacherProfileFile)
          formData.append("profilePicture", teacherProfileFile);

        const res = await fetch(`${API}/teacher/register`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        // safe parse
        let data;
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          const preview =
            text && text.length > 1000 ? text.slice(0, 1000) + "..." : text;
          data = {
            message: `Non-JSON response (status ${res.status}): ${preview}`,
          };
        }
        if (!res.ok)
          throw new Error(data.message || "Teacher registration failed");
        alert(
          "Teacher registration successful! Redirecting to teachers list..."
        );
        navigate("/teachers");
      } else {
        // teacher sign in (existing behavior)
        const payload = {
          email: teacherForm.email,
          password: teacherForm.password,
        };

        const res = await fetch(`${API}/teacher/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        const meRes = await fetch(`${API}/user/me`, { credentials: "include" });
        if (meRes.ok) navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Welcome to JudgeTutor
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Choose your role to continue
            </p>
          </div>

          {/* Tab System */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-4 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("student")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "student"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Student Portal
                </button>
                <button
                  onClick={() => setActiveTab("teacher")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "teacher"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Teacher Portal
                </button>
              </nav>
            </div>

            <div className="p-8">
              {/* Student Tab */}
              {activeTab === "student" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Student Portal
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          setStudentForm((prev) => ({
                            ...prev,
                            isSignUp: false,
                          }))
                        }
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          !studentForm.isSignUp
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Student Sign In
                      </button>
                      <button
                        onClick={() =>
                          setStudentForm((prev) => ({
                            ...prev,
                            isSignUp: true,
                          }))
                        }
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          studentForm.isSignUp
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Student Sign Up
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleStudentSubmit} className="space-y-6">
                    {studentForm.isSignUp ? (
                      // Student Sign Up Form
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="student-fullname"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name *
                          </label>
                          <input
                            id="student-fullname"
                            name="fullName"
                            type="text"
                            required
                            value={studentForm.fullName}
                            onChange={handleStudentInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="student-email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email Address *
                          </label>
                          <input
                            id="student-email"
                            name="email"
                            type="email"
                            required
                            value={studentForm.email}
                            onChange={handleStudentInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your email"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="student-university"
                            className="block text-sm font-medium text-gray-700"
                          >
                            University *
                          </label>
                          <select
                            id="student-university"
                            name="university"
                            required
                            value={studentForm.university}
                            onChange={handleStudentInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                          >
                            <option value="">Select your university</option>
                            {colleges.map((university) => (
                              <option key={university} value={university}>
                                {university}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="student-profilePicture"
                            className="block text-sm font-medium text-gray-700 mt-2"
                          >
                            Profile Picture (optional)
                          </label>
                          <input
                            id="student-profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={handleStudentFileChange}
                            className="mt-1 block w-full text-sm text-gray-700"
                          />
                          {studentPreview && (
                            <div className="mt-3 text-center">
                              <img
                                src={studentPreview}
                                alt="Student preview"
                                className="avatar-md mx-auto border border-gray-200"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="student-password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password *
                          </label>
                          <input
                            id="student-password"
                            name="password"
                            type="password"
                            required
                            value={studentForm.password}
                            onChange={handleStudentInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Create a password"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="student-confirm-password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Confirm Password *
                          </label>
                          <input
                            id="student-confirm-password"
                            name="confirmPassword"
                            type="password"
                            required
                            value={studentForm.confirmPassword}
                            onChange={handleStudentInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Confirm your password"
                          />
                        </div>
                      </div>
                    ) : (
                      // Student Sign In Form
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="email-address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email address
                          </label>
                          <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={studentForm.email}
                            onChange={handleStudentInputChange}
                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={studentForm.password}
                            onChange={handleStudentInputChange}
                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your password"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              name="rememberMe"
                              type="checkbox"
                              checked={studentForm.rememberMe}
                              onChange={handleStudentInputChange}
                              className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="remember-me"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Remember me
                            </label>
                          </div>

                          <div className="text-sm">
                            <a
                              href="#"
                              className="font-medium text-gray-900 hover:text-gray-700"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting
                          ? studentForm.isSignUp
                            ? "Creating Account..."
                            : "Signing in..."
                          : studentForm.isSignUp
                          ? "Create Student Account"
                          : "Sign in as Student"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Teacher Tab */}
              {activeTab === "teacher" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Teacher Portal
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          setTeacherForm((prev) => ({
                            ...prev,
                            isSignUp: true,
                          }))
                        }
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          teacherForm.isSignUp
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Teacher Sign Up
                      </button>
                      <button
                        onClick={() =>
                          setTeacherForm((prev) => ({
                            ...prev,
                            isSignUp: false,
                          }))
                        }
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          !teacherForm.isSignUp
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Teacher Sign In
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleTeacherSubmit} className="space-y-6">
                    {teacherForm.isSignUp ? (
                      // Teacher Sign Up Form
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="teacher-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name *
                          </label>
                          <input
                            id="teacher-name"
                            name="name"
                            type="text"
                            required
                            value={teacherForm.name}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="teacher-email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email Address *
                          </label>
                          <input
                            id="teacher-email"
                            name="email"
                            type="email"
                            required
                            value={teacherForm.email}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your email"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="teacher-profilePicture"
                            className="block text-sm font-medium text-gray-700 mt-2"
                          >
                            Profile Picture (optional)
                          </label>
                          <input
                            id="teacher-profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={handleTeacherFileChange}
                            className="mt-1 block w-full text-sm text-gray-700"
                          />
                          {teacherPreview && (
                            <div className="mt-3 text-center md:text-left">
                              <img
                                src={teacherPreview}
                                alt="Teacher preview"
                                className="avatar-md mx-auto md:mx-0 border border-gray-200"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="teacher-university"
                            className="block text-sm font-medium text-gray-700"
                          >
                            University *
                          </label>
                          <select
                            id="teacher-university"
                            name="university"
                            required
                            value={teacherForm.university}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                          >
                            <option value="">Select your university</option>
                            {colleges.map((university) => (
                              <option key={university} value={university}>
                                {university}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="teacher-subjects"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Subjects / Expertise *
                          </label>
                          <textarea
                            id="teacher-subjects"
                            name="subjects"
                            required
                            rows={3}
                            value={teacherForm.subjects}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter subjects separated by commas or new lines (e.g. DSA, Web Dev, DBMS)"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Enter one or more subjects separated by commas or
                            new lines
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="teacher-experience"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Years of Experience *
                          </label>
                          <input
                            id="teacher-experience"
                            name="experience"
                            type="number"
                            required
                            min="0"
                            max="50"
                            value={teacherForm.experience}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter years of experience"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="teacher-password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password *
                          </label>
                          <input
                            id="teacher-password"
                            name="password"
                            type="password"
                            required
                            value={teacherForm.password}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Create a password"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="teacher-description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description *
                          </label>
                          <textarea
                            id="teacher-description"
                            name="description"
                            rows={3}
                            required
                            value={teacherForm.description}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Tell students about your teaching style and experience"
                          />

                          <label
                            htmlFor="teacher-achievements"
                            className="block text-sm font-medium text-gray-700 mt-4"
                          >
                            Key Achievements
                          </label>
                          <textarea
                            id="teacher-achievements"
                            name="achievements"
                            rows={3}
                            value={teacherForm.achievements}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="List your awards, research papers, certifications, etc."
                          />
                        </div>
                      </div>
                    ) : (
                      // Teacher Sign In Form
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="teacher-signin-email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <input
                            id="teacher-signin-email"
                            name="email"
                            type="email"
                            required
                            value={teacherForm.email}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="teacher-signin-password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <input
                            id="teacher-signin-password"
                            name="password"
                            type="password"
                            required
                            value={teacherForm.password}
                            onChange={handleTeacherInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            placeholder="Enter your password"
                          />
                        </div>
                      </div>
                    )}

                    {teacherForm.isSignUp && (
                      <div className="flex items-center">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="terms"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 underline"
                          >
                            Terms and Conditions
                          </a>
                        </label>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting
                          ? teacherForm.isSignUp
                            ? "Creating Account..."
                            : "Signing in..."
                          : teacherForm.isSignUp
                          ? "Register as Teacher"
                          : "Sign in as Teacher"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
