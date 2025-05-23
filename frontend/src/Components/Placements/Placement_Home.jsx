import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { X, Menu } from "lucide-react";
import {
  FaUniversity,
  FaUserGraduate,
  FaChartBar,
  FaBriefcase,
  FaBook,
  FaUsers
} from "react-icons/fa";

const Placement_Home = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password cannot be the same as the old password.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in!");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/employee/change-password",
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setError("");
      setLoading(false);
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setMessage("");
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">College Placement</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-lg">
          <NavLink to="/placement-homepage" text="Home" />
          <NavLink to="/placement-homepages/results" text="Results" />
          <NavLink to="/placement-homepages/applied-students" text="Applied Students" />
          <button
            className="hover:text-gray-200 transition"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            Change Password
          </button>
          <NavLink to="/placement-homepages/profile" text="Profile" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-blue-600 text-white p-4 space-y-3">
          <NavLink to="/placement-homepages" text="Home" onClick={() => setMenuOpen(false)} />
          <NavLink to="/placement-homepages/jobs" text="Jobs" onClick={() => setMenuOpen(false)} />
          <button onClick={() => { setIsChangePasswordOpen(true); setMenuOpen(false); }}>
            Change Password
          </button>
          <NavLink to="/placement-homepages/profile" text="Profile" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FaUserGraduate className="text-5xl text-green-600" />}
          title="View Students"
          description="Search students by course, branch, and section."
          buttonText="Search Students"
          linkTo="/placement-homepages/students" // New page route
        />

        <FeatureCard
          icon={<FaBriefcase className="text-5xl text-blue-600" />}
          title="Ongoing Recruitments"
          description="View all company recruitment lists with details."
          buttonText="View Details"
          linkTo="/placement-homepages/recruitments"
        />

        <FeatureCard
          icon={<FaUniversity className="text-5xl text-indigo-600" />}
          title="Incoming Companies"
          description="Check which companies are coming for recruitment."
          buttonText="View Companies"
          linkTo="/placement-homepages/companies"
        />

        <FeatureCard
          icon={<FaUsers className="text-5xl text-purple-600" />}
          title="Outgoing Students"
          description="See students who are placed in top companies."
          buttonText="View List"
          linkTo="/placement-homepages/outgoing-students"
        />
        <FeatureCard
          icon={<FaChartBar className="text-5xl text-yellow-600" />}
          title="Statistics"
          description="Graphical representation of placements & job offers."
          buttonText="View Stats"
        />
        
        <FeatureCard
          icon={<FaBook className="text-5xl text-red-600" />}
          title="Placement Policy"
          description="Read the guidelines and policies for placement."
          buttonText="View Policy"
          linkTo="/placement-homepages/policy"
        />
      </div>
      {/* Partner Companies */}
      <section className="bg-gray-200 py-12 text-center">
        <h3 className="text-3xl font-semibold">Top Hiring Companies</h3>
        <div className="flex justify-center gap-10 mt-6 flex-wrap">
          <img src="https://tse3.mm.bing.net/th?id=OIP.qiidhihdaOqzaYRIl950aQHaE8&pid=Api&P=0&h=180" alt="Wipro" className="h-12" />
          <img src="https://tse1.mm.bing.net/th?id=OIP.ZlzwoB6b_VEZ63CRj4R5qgHaC9&pid=Api&P=0&h=180" alt="Infoysis" className="h-12" />
          <img src="https://thumbs.dreamstime.com/b/utrecht-netherlands-may-capgemini-logo-sign-building-french-multinational-information-technology-services-consulting-280685793.jpg" alt="Microsoft" className="h-12" />
          <img src="https://tse1.mm.bing.net/th?id=OIP.uJ7t8IOM9eroFbp5zKIGTQHaEq&pid=Api&P=0&h=180" alt="TCS" className="h-12" />
        </div>
      </section>

      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            {/* Show Success or Error Messages */}
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}

            {!message && (
              <>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your old password..."
                  className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring focus:ring-blue-200"

                  onChange={(e) => setOldPassword(e.target.value)}
                />

                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter a new password..."
                  className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring focus:ring-blue-200"

                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new password..."
                  className="w-full p-2 border border-gray-300 rounded mb-4 focus:ring focus:ring-blue-200"

                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700 transition"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </button>
              </>
            )}

            {!message && (
              <button
                className="mt-2 text-red-500 hover:underline"
                onClick={() => setIsChangePasswordOpen(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

const NavLink = ({ to, text, onClick }) => (
  <Link to={to} className="hover:underline text-lg" onClick={onClick}>
    {text}
  </Link>
);

const FeatureCard = ({ icon, title, description, buttonText, linkTo }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-1">
    {icon}
    <h3 className="text-xl font-semibold mt-2">{title}</h3>
    <p className="text-gray-600 text-center mt-2">{description}</p>
    <Link to={linkTo} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
      {buttonText}
    </Link>
  </div>
);

const InputField = ({ label, type, onChange }) => (
  <>
    <label className="block text-gray-700 text-sm font-semibold">{label}</label>
    <input type={type} className="w-full p-2 border border-gray-300 rounded mb-2" onChange={(e) => onChange(e.target.value)} />
  </>
);

export default Placement_Home;
