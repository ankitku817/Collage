import React, { useState } from "react";
import axios from "axios";
import {
    FaUniversity,
    FaUserGraduate,
    FaChartBar,
    FaBriefcase,
    FaBook,
    FaBars,
    FaUsers
} from "react-icons/fa";
import { X, User, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CHeader from "./CHeader";

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isStudentRegisterOpen, setIsStudentRegisterOpen] = useState(false);
    const [isPlacementRegisterOpen, setIsPlacementRegisterOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [uniqueCode, setUniqueCode] = useState("");
    const [password, setPassword] = useState("");
    const [empId, setEmpId] = useState("");
    const [rollcode, setRollCode] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            <CHeader />
            <button
                className="lg:hidden fixed top-4 left-4 z-50 text-gray-800 p-2 bg-white shadow-lg rounded-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <FaBars size={24} />}
            </button>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-64 p-6 shadow-lg rounded-lg">
                        <button className="text-red-500 absolute top-4 right-4" onClick={() => setIsSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                        <ul className="mt-6 space-y-4 text-center">
                            <li>
                                <Link to="/" className="text-gray-800 hover:text-blue-600">Home</Link>
                            </li>
                            <li>
                                <Link to="/students" className="text-gray-800 hover:text-blue-600">Students</Link>
                            </li>
                            <li>
                                <Link to="/statistics" className="text-gray-800 hover:text-blue-600">Statistics</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Ongoing Recruitments */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
                    <FaBriefcase className="text-5xl text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold">Ongoing Recruitments</h3>
                    <p className="text-gray-600 text-center mt-2">View all company recruitment lists with details.</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        View Details
                    </button>
                </div>

                {/* View Students */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
                    <FaUserGraduate className="text-5xl text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold">View Students</h3>
                    <p className="text-gray-600 text-center mt-2">Search students by course, branch, and section.</p>
                    <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
                        Search Students
                    </button>
                </div>

                {/* Statistics */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
                    <FaChartBar className="text-5xl text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold">Statistics</h3>
                    <p className="text-gray-600 text-center mt-2">Graphical representations of placements & job offers.</p>
                    <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                        View Statistics
                    </button>
                </div>

                {/* Policy */}
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
                    <FaBook className="text-5xl text-indigo-600 mb-4" />
                    <h3 className="text-xl font-semibold">Placement Policy</h3>
                    <p className="text-gray-600 text-center mt-2">Read the guidelines and policies for placement.</p>
                    <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
                        View Policy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
