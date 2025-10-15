import { useMemo } from "react";
import useSWR from "swr";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

function RatingStars({ value = 0 }) {
  const max = 5;
  const clamped = Math.min(Math.max(value, 0), max);
  const filled = Math.round(clamped);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${clamped} out of 5`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            i < filled ? "text-primary" : "text-muted-foreground/40"
          )}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
      <span className="ml-2 text-xs text-muted-foreground">
        {clamped.toFixed(1)}
      </span>
    </div>
  );
}

function RankBadge({ rank }) {
  const labels = ["No. 1", "No. 2", "No. 3"];
  const rankLabel = labels[rank - 1] || `#${rank}`;
  const variant = rank === 1 ? "default" : rank === 2 ? "secondary" : "outline";

  return (
    <Badge
      variant={variant}
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide backdrop-blur-sm",
        rank === 1 && "bg-primary text-primary-foreground shadow-md"
      )}
    >
      {rankLabel}
    </Badge>
  );
}

function TeacherSkeleton() {
  return (
    <Card className="bg-card border-border shadow-sm animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-44 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="h-9 w-24 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function TopTeachers({ limit = 4 }) {
  const { data, error, isLoading, mutate } = useSWR(
    `${API}/teacher/all`,
    fetcher
  );

  const teachers = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const sorted = list
      .slice()
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    return sorted.slice(0, limit);
  }, [data, limit]);

  return (
    <section
      className="mt-12 mx-3 sm:mx-4 md:mx-10 lg:mx-20"
      aria-labelledby="top-teachers-heading"
    >
      <Card className="overflow-hidden border-border shadow-xl rounded-3xl">
        {/* Header with gradient accent */}
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent">
          <CardTitle
            id="top-teachers-heading"
            className="text-center text-3xl font-semibold text-foreground"
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Top Teachers
            </span>
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Discover the most inspiring educators rated by our students.
          </p>
          <div className="mt-3 flex justify-center">
            <div className="h-1 w-16 rounded-full bg-primary/30" />
          </div>
        </CardHeader>

        <CardContent className="p-3 md:p-8 space-y-5">
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <TeacherSkeleton key={i} />
                ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-muted-foreground">
                Couldn’t load teachers right now.
              </p>
              <Button variant="outline" onClick={() => mutate()}>
                Try again
              </Button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && teachers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No teachers yet. Check back later.
              </p>
            </div>
          )}

          {/* Teacher list */}
          {!isLoading && !error && teachers.length > 0 && (
            <ul className="grid grid-cols-1 gap-3 md:gap-6">
              {teachers.map((teacher, index) => {
                const rank = index + 1;
                const school =
                  teacher?.collageId?.name ||
                  teacher?.university ||
                  teacher?.institution ||
                  "Institution";
                // prefer explicit avatar (data URI) if present, otherwise use backend avatar endpoint, fallback to local dummy
                const avatarSrc =
                  teacher?.avatar ||
                  `${API}/teacher/${teacher?._id || teacher?.id}/avatar` ||
                  "/teacher-avatar.png";
                const initials = (teacher?.name || "T")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                const glow =
                  rank === 1
                    ? "bg-gradient-to-r from-primary/10 to-transparent shadow-[0_0_20px_-5px_theme(colors.primary/40)]"
                    : rank === 2
                    ? "bg-gradient-to-r from-secondary/10 to-transparent shadow-[0_0_14px_-6px_theme(colors.secondary/40)]"
                    : rank === 3
                    ? "bg-muted/60"
                    : "bg-card";

                return (
                  <li key={teacher?._id || index}>
                    <Card
                      className={cn(
                        "group border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-2xl",
                        glow
                      )}
                    >
                      <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative">
                            <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition">
                              <AvatarImage
                                src={avatarSrc}
                                alt={teacher?.name || "Teacher"}
                                onError={(e) => {
                                  e.currentTarget.src = "/teacher-avatar.png";
                                }}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div
                              className="absolute -bottom-1 -right-1"
                              aria-hidden="true"
                            >
                              <RankBadge rank={rank} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-sm md:text-base truncate group-hover:text-primary transition">
                              {teacher?.name || "Unknown"}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {school}
                            </p>
                            <div className="mt-2">
                              <RatingStars
                                value={teacher?.averageRating || 0}
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="shrink-0 text-primary hover:bg-primary/10"
                        >
                          <Link
                            to={`/teacher/${teacher?._id || ""}`}
                            className="flex items-center gap-2"
                          >
                            View
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer Button */}
          <div className="text-center pt-4">
            <Button
              variant="default"
              asChild
              className="px-6 shadow-md hover:shadow-lg transition"
            >
              <Link to="/signin">Sign in to see all teachers</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
