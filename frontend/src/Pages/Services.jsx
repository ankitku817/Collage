import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaBriefcase, FaBuilding, FaGlobe, FaHandshake } from "react-icons/fa";
import serviceImg from "../assets/images/services.jpg"; // Ensure correct image path

const services = [
  {
    title: "Career Guidance",
    description: "Get expert career counseling and mentorship to shape your future.",
    icon: <FaUserGraduate className="text-4xl text-indigo-600" />,
  },
  {
    title: "Skill Development",
    description: "Enhance your skills with our exclusive training programs.",
    icon: <FaChalkboardTeacher className="text-4xl text-blue-600" />,
  },
  {
    title: "Internship Opportunities",
    description: "Find top internships to gain real-world experience.",
    icon: <FaBriefcase className="text-4xl text-green-600" />,
  },
  {
    title: "Company Partnerships",
    description: "Connect with top recruiters for the best placement opportunities.",
    icon: <FaBuilding className="text-4xl text-red-600" />,
  },
  {
    title: "Global Placements",
    description: "Get placed in international companies with high-paying jobs.",
    icon: <FaGlobe className="text-4xl text-yellow-600" />,
  },
  {
    title: "Alumni Network",
    description: "Join our alumni network for guidance and career advancement.",
    icon: <FaHandshake className="text-4xl text-purple-600" />,
  },
];

const Services = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 py-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${serviceImg})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold text-indigo-700">Our Services</h2>
        <p className="text-gray-600 mt-4">Empowering students with the best career opportunities.</p>
      </div>

      {/* Services Grid */}
      <div className="relative z-10 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
            </div>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
