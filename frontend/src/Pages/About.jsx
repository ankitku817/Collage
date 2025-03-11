import React from "react";
import { FaGraduationCap, FaUsers, FaBriefcase, FaGlobe } from "react-icons/fa";
import aboutImage from "../assets/images/about.jpg"; 
import successImage from "../assets/images/success.jpg"; 

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative">
        <img src={aboutImage} alt="About Us" className="w-full h-96 object-cover brightness-75" />
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold">About Our College Placements</h1>
          <p className="text-lg mt-2 max-w-2xl">
            Empowering students with industry-relevant skills and connecting them with top recruiters.
          </p>
        </div> */}
      </div>

      {/* Mission & Vision Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-indigo-600">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To provide high-quality education and bridge the gap between academia and industry, ensuring that our students are prepared for successful careers.
            </p>
            <h2 className="text-4xl font-bold text-indigo-600 mt-8">Our Vision</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To be a leading institution recognized globally for excellence in education, innovation, and career placements.
            </p>
          </div>
          <div>
            <img src={successImage} alt="Success" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* Placement Success Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">Our Placement Success</h2>
          <p className="text-center mt-4 text-lg max-w-2xl mx-auto">
            We take pride in our exceptional placement record, with students placed in top multinational companies.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-12 text-center">
            <div className="flex flex-col items-center">
              <FaGraduationCap className="text-6xl" />
              <h3 className="text-2xl font-semibold mt-4">5000+</h3>
              <p className="text-lg">Graduates</p>
            </div>

            <div className="flex flex-col items-center">
              <FaUsers className="text-6xl" />
              <h3 className="text-2xl font-semibold mt-4">200+</h3>
              <p className="text-lg">Recruiters</p>
            </div>

            <div className="flex flex-col items-center">
              <FaBriefcase className="text-6xl" />
              <h3 className="text-2xl font-semibold mt-4">95%</h3>
              <p className="text-lg">Placement Rate</p>
            </div>

            <div className="flex flex-col items-center">
              <FaGlobe className="text-6xl" />
              <h3 className="text-2xl font-semibold mt-4">30+</h3>
              <p className="text-lg">Global Partners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-16">
        <h2 className="text-4xl font-bold text-indigo-600">Join Our Success Journey</h2>
        <p className="text-lg text-gray-600 mt-4">
          Take the first step towards a bright future with our industry-leading placement programs.
        </p>
        <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default About;
