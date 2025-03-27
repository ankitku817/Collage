
import React, { useState } from "react";
import axios from "axios";
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

            {/* Hero Section */}
            <header className="bg-blue-500 text-white text-center py-20 px-4">
                <h2 className="text-4xl font-extrabold">Find Your Dream Job</h2>
                <p className="mt-4 text-lg">Explore top companies and apply for jobs that match your skills.</p>
                <Link to="/jobs">
                    <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                        Explore Jobs
                    </button>
                </Link>
            </header>

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
