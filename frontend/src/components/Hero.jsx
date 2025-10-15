import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Discover & rate amazing
            <br className="hidden md:block" /> teachers in your college.
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Share your classroom experiences, help others make better choices,
            and celebrate great educators.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 pt-4 w-full">
            <Link
              to="/signin"
              className="px-6 py-3 rounded-xl text-white bg-gray-900 hover:bg-gray-800 font-medium shadow-md transition w-full sm:w-auto text-center"
            >
              Get Started →
            </Link>
            <button className="px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-800 font-medium transition w-full sm:w-auto">
              Learn More
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center lg:justify-start gap-2 pt-3">
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l2.95 6.1 6.73.98-4.87 4.75 1.15 6.71L12 17.77 6.04 20.54 7.2 13.83 2.33 9.08l6.72-.98L12 2z" />
                </svg>
              ))}
              <svg
                className="h-5 w-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l2.95 6.1 6.73.98-4.87 4.75 1.15 6.71L12 17.77 6.04 20.54 7.2 13.83 2.33 9.08l6.72-.98L12 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              4.8/5 average rating from students
            </p>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="flex-1 relative">
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-xl">
                <svg
                  className="h-10 w-10 text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L1 8l11 5 8-3.636V15h2V8L12 3z" />
                </svg>
              </div>

              <p className="text-xl font-semibold text-gray-800">
                1000+ Teachers Rated
              </p>
              <p className="text-gray-500 text-sm max-w-xs">
                See reviews and insights from real students to find your next
                great mentor.
              </p>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md">
              ⭐ 5000+ Reviews Added
            </div>
          </div>

          {/* Background Accent Circles */}
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-indigo-100 blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-purple-100 blur-3xl opacity-40"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
