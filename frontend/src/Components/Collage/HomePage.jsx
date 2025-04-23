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
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CHeader from "./CHeader";

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            <CHeader />

            {/* Sidebar Toggle Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 text-gray-800 p-2 bg-white shadow-lg rounded-full"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <FaBars size={24} />}
            </button>

            {/* Sidebar Modal */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-64 p-6 shadow-lg rounded-lg relative">
                        <button
                            className="text-red-500 absolute top-4 right-4"
                            onClick={() => setIsSidebarOpen(false)}
                        >
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
                            <li>
                                <Link to="/placements" className="text-gray-800 hover:text-blue-600">Placements</Link>
                            </li>
                            <li>
                                <Link to="/companies" className="text-gray-800 hover:text-blue-600">Companies</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-screen-2xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">
                    🎓 Welcome to College Placement Cell – Admin Dashboard
                </h1>
                <p className="text-gray-700 text-center mb-8 max-w-3xl mx-auto">
                    This is your control center for managing student data, placement drives, company details, and statistics.
                    Use the navigation to access different sections and streamline the campus recruitment process efficiently.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
