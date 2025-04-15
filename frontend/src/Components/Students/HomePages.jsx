
import React, { useState } from "react";
import axios from "axios";
import View_Student from '../Placements/View_Students'
import {
    FaUniversity,
    FaUserGraduate,
    FaChartBar,
    FaBriefcase,
    FaBook,
    FaBars,
    FaUsers,
    FaUser
} from "react-icons/fa";
import { X, User, LogOut, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const HomePages = () => {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
    const [message, setMessage] = useState("");
      const [menuOpen, setMenuOpen] = useState(false);
    
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
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
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
                "http://localhost:5000/api/student/change-password",
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

            // Auto-close modal after 3 seconds
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
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">College Placement</h1>
                <div className="space-x-6">
                    <Link to="/student-homepage" className="hover:underline">Home</Link>
                    <Link to="/student-homepage/jobs" className="hover:underline">Jobs</Link>
                    <button className="hover:text-gray-200 transition" onClick={() => setIsChangePasswordOpen(true)}>
                        Change Password
                    </button>
                    <Link to="/student-homepage/profile" className="hover:underline">Profile</Link>
                </div>
            </nav>

            {/* Main Content */}
                 <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   <FeatureCard
                     icon={<FaUserGraduate className="text-5xl text-green-600" />}
                     title="View Students"
                     description="Search students by course, branch, and section."
                     buttonText="Search Students"
                    linkTo="/student-homepage/students" // New page route
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
                    linkTo="/student-homepage/incoming-companies"
                   />
           
                   <FeatureCard
                     icon={<FaUsers className="text-5xl text-purple-600" />}
                     title="Outgoing Students"
                     description="See students who are placed in top companies."
                     buttonText="View List"
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
                   />
                 </div>

            {/* Featured Jobs */}
            <section className="py-12 px-6">
                <h3 className="text-3xl font-semibold text-center mb-6">Featured Job Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example Job Cards */}
                    <JobCard title="Software Engineer" company="Google" location="Remote" />
                    <JobCard title="Data Analyst" company="Amazon" location="New York, USA" />
                    <JobCard title="Frontend Developer" company="Microsoft" location="Bangalore, India" />
                </div>
            </section>

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
            
                { isChangePasswordOpen && (
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
const JobCard = ({ title, company, location }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold">{title}</h4>
            <p className="text-gray-700">{company}</p>
            <p className="text-gray-500">{location}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Apply Now
            </button>
        </div>
    );
};

export default HomePages;
