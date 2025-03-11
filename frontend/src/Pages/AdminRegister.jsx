import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaPhone } from "react-icons/fa";
import agcbg from "../assets/images/agc-bg.jpg";

const AdminRegistration = () => {
    const [admin, setAdmin] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        collegeName: "",
    });
    const [uniqueCode, setUniqueCode] = useState(null); 

    const handleChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/admin/register", admin);
            alert("Admin Registered Successfully!");
            setUniqueCode(response.data.uniqueCode); 
            setAdmin({ name: "", email: "", phone: "", password: "", collegeName: "" });
        } catch (error) {
            alert("Error registering admin");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
            style={{ backgroundImage: `url(${agcbg})` }}
        >
            <div className="bg-white bg-opacity-90 shadow-lg rounded-xl p-8 w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-600">College Admin Registration</h2>
                <p className="text-gray-600 text-center mt-2">Register as a college admin below</p>
                {uniqueCode && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md text-center mt-4">
                        Your UserId: <strong>{uniqueCode}</strong>
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-3 text-gray-500" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={admin.name}
                            onChange={handleChange}
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 hover:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-3 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={admin.email}
                            onChange={handleChange}
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 hover:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute left-4 top-3 text-gray-500" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={admin.phone}
                            onChange={handleChange}
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 hover:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-4 top-3 text-gray-500" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={admin.password}
                            onChange={handleChange}
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 hover:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FaUniversity className="absolute left-4 top-3 text-gray-500" />
                        <input
                            type="text"
                            name="collegeName"
                            placeholder="College Name"
                            value={admin.collegeName}
                            onChange={handleChange}
                            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 hover:border-indigo-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition font-semibold text-lg"
                    >
                        Register Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegistration;
