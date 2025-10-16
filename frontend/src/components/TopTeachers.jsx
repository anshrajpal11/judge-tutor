import { useMemo } from "react";
import useSWR from "swr";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

function RatingStars({ value = 0 }) {
  const max = 5;
  const filled = Math.round(Math.min(Math.max(value, 0), max));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${
            i < filled ? "text-yellow-400" : "text-muted-foreground/30"
          }`}
          fill="currentColor"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function RankBadge({ rank }) {
  const variant =
    rank === 1
      ? "bg-primary text-white"
      : rank === 2
      ? "bg-gray-300 text-gray-800"
      : "bg-gray-200 text-gray-700";
  const label = rank === 1 ? "No. 1" : rank === 2 ? "No. 2" : "No. 3";
  return (
    <Badge
      className={`${variant} text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm`}
    >
      {label}
    </Badge>
  );
}

export default function TopTeachers() {
  const { data, error, isLoading } = useSWR(`${API}/teacher/all`, fetcher);

  const teachers = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list
      .slice()
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 3);
  }, [data]);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 50, rotateX: 15 },
    show: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 } },
  };

  return (
    <section className="py-20 mx-4 sm:mx-10 md:mx-20 text-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl -z-10" />

      {/* Header */}
      <div className="mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              Top Rated Teachers
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover excellence in education with our highest-rated educators, chosen by students for their outstanding teaching quality.
          </p>
        </motion.div>
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg" />
        </motion.div>
      </div>

      {/* Loading / Error */}
      {isLoading && <p className="text-muted-foreground">Loading top teachers...</p>}
      {!isLoading && error && <p className="text-red-500">Failed to load teachers.</p>}

      {/* Teacher Cards */}
      {!isLoading && teachers.length > 0 && (
        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-7xl mx-auto"
        >
          {teachers.map((teacher, index) => {
            const rank = index + 1;
            const school =
              teacher?.collageId?.name ||
              teacher?.university ||
              teacher?.institution ||
              "Institution";
            const initials = (teacher?.name || "T")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            const avatarSrc =
              teacher?.avatar ||
              `${API}/teacher/${teacher?._id}/avatar` ||
              "/teacher-avatar.png";

            return (
              <motion.li key={teacher?._id} variants={item}>
                <Card className="rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group cursor-pointer bg-white/90">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Rank Badge */}
                  

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>

                  <CardContent className="p-8 flex flex-col items-center space-y-4 relative">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <Avatar className="h-24 w-24 ring-4 ring-white/50 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:ring-primary/30 relative z-10 group-hover:rotate-3">
                        <AvatarImage src={avatarSrc} alt={teacher?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg group-hover:from-secondary group-hover:to-primary transition-all duration-500">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 z-20">
                        <RankBadge rank={rank} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-3">
                      <h3 className="font-bold text-xl text-neutral-800 hover:text-primary transition-colors duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                        {teacher?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">{school}</p>

                      {/* Subject/Specialization Badges */}
                      {teacher?.subjects && teacher.subjects.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                          {teacher.subjects.slice(0, 2).map((subject, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 text-xs px-3 py-1 rounded-full font-medium"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col items-center space-y-3 bg-gradient-to-r from-white/80 to-gray-50/80 rounded-2xl px-6 py-4 shadow-lg border border-white/50 backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <RatingStars value={teacher?.averageRating || 0} />
                        <span className="text-lg font-bold text-neutral-800 ml-2">
                          {(teacher?.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          {(teacher?.reviewCount || 0)} reviews
                        </span>
                        <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    {teacher?.totalStudents && (
                      <motion.div
                        className="flex justify-center gap-6 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <motion.div
                          className="flex flex-col items-center group/stat"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-primary group-hover/stat:text-primary/80 transition-colors">
                            {teacher.totalStudents}
                          </div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </motion.div>
                        {teacher?.experience && (
                          <>
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent"></div>
                            <motion.div
                              className="flex flex-col items-center group/stat"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="text-2xl font-bold text-secondary group-hover/stat:text-secondary/80 transition-colors">
                                {teacher.experience}
                              </div>
                              <div className="text-xs text-muted-foreground">Years Exp.</div>
                            </motion.div>
                          </>
                        )}
                        <div className="w-px h-8 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent"></div>
                        <motion.div
                          className="flex flex-col items-center group/stat"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-2xl font-bold text-green-600 group-hover/stat:text-green-500 transition-colors">
                            {Math.floor((teacher?.averageRating || 0) * 20)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Button */}
                    <Button
                      variant="ghost"
                      asChild
                      className="mt-6 bg-gray-100 flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg"
                    >
                      <Link to={`/teacher/${teacher?._id}`}>
                        View Profile
                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {/* CTA Section */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-xl">
          <h3 className="text-2xl font-bold text-neutral-800 mb-3">
            Ready to Find Your Perfect Teacher?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of students who have found their ideal educators through our platform.
          </p>
          <Button
            asChild
            className="px-8 py-4 bg-gray-600 rounded-full font-semibold  text-lg"
          >
            <Link to="/signin">
              Explore All Teachers
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

