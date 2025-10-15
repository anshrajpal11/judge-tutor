import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    subjects: "",
    experience: "",
    achievements: "",
    description: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [colleges, setColleges] = useState([]);

  React.useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetchColleges = async () => {
      try {
        const res = await fetch(`${API}/college/all`);
        if (!res.ok) throw new Error("Failed to fetch colleges");
        const data = await res.json();
        if (Array.isArray(data)) setColleges(data.map((c) => c.name));
      } catch (err) {
        console.error(err);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("collageName", formData.university);
      form.append("subjects", formData.subjects);
      form.append("description", formData.description);
      form.append("achievements", formData.achievements);
      form.append("experience", String(formData.experience));
      const fileInput = document.getElementById("teacherProfilePicture");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        form.append("profilePicture", fileInput.files[0]);
      }

      const res = await fetch(`${API}/teacher/register`, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Teacher registration failed");
      alert("Registration successful! Redirecting to teachers list...");
      navigate("/teachers");
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
              Teacher Registration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join JudgeTutor as an educator and connect with students
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="teacherProfilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture (optional)
                </label>
                <input
                  id="teacherProfilePicture"
                  name="teacherProfilePicture"
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-900"
                />
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>

                <div>
                  <label
                    htmlFor="university"
                    className="block text-sm font-medium text-gray-700"
                  >
                    University *
                  </label>
                  <select
                    id="university"
                    name="university"
                    required
                    value={formData.university}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
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
                    htmlFor="subjects"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subjects/Expertise *
                  </label>
                  <textarea
                    id="subjects"
                    name="subjects"
                    rows={3}
                    required
                    value={formData.subjects}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    placeholder="Enter subjects separated by commas (e.g. DSA, Web Dev, DBMS)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter one or more subjects separated by commas (you can
                    paste many subjects or type each on a new line)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    placeholder="Tell students about your teaching style and experience"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Years of Experience *
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <label
                htmlFor="achievements"
                className="block text-sm font-medium text-gray-700"
              >
                Key Achievements
              </label>
              <textarea
                id="achievements"
                name="achievements"
                rows={4}
                value={formData.achievements}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="List your awards, research papers, certifications, etc. (e.g., 'Best Teacher Award 2023, Published 25+ Research Papers, IEEE Fellow')"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple achievements with commas
              </p>
            </div>

            {/* Terms and Conditions */}
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
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Creating Account..." : "Register as Teacher"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have a teacher account?{" "}
                <a
                  href="#"
                  className="font-medium text-gray-900 hover:text-gray-700"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherLogin;
