import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Teachers from "./pages/Teachers";
import AddReview from "./pages/AddReview";
import Rankings from "./pages/Rankings";
import UserProfile from "./pages/UserProfile";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherProfile from "./pages/TeacherProfile";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/signin"} element={<SignIn />} />
          <Route path={"/teachers"} element={<Teachers />} />
          <Route path={"/add-review"} element={<AddReview />} />
          <Route path={"/rankings"} element={<Rankings />} />
          <Route path={"/user-profile"} element={<UserProfile />} />
          <Route path={"/teacher-dashboard"} element={<TeacherDashboard />} />
          <Route
            path={"/teacher-profile/:teacherId"}
            element={<TeacherProfile />}
          />
          <Route path={"/teacher/:teacherId"} element={<TeacherProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
