import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import TopTeachers from "@/components/TopTeachers";
import Footer from "@/components/Footer";
import React from "react";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <TopTeachers />
      <Footer />
    </div>
  );
};

export default Home;
