import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandSection from "./components/BrandSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: "#fff", color: "#000" }}>
      <Navbar />
      <main>
        <Hero />

        <ServicesSection />
        <BrandSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
