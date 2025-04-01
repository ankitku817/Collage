import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/agc-logo.png";
import { UserCircle, LogOut, X, User, Lock, Loader2, Menu } from "lucide-react";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [uniqueCode, setUniqueCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [admin, setAdmin] = useState(null);
    const [student, setStudent] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        const storedStudent = localStorage.getItem("student");
        const storedEmployee = localStorage.getItem("employee");

        if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
        if (storedStudent) setStudent(JSON.parse(storedStudent));
        if (storedEmployee) setEmployee(JSON.parse(storedEmployee));
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            let response;
            if (uniqueCode.length === 10) {
                response = await axios.post("http://localhost:5000/api/admin/login", { uniqueCode, password });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("admin", JSON.stringify(response.data.admin));
                setAdmin(response.data.admin);
                setIsLoginOpen(false);
                navigate("/collage-homepage");
            } else if (uniqueCode.length === 7) {
                response = await axios.post("http://localhost:5000/api/student/login-student", { rollcode: uniqueCode, password });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("student", JSON.stringify(response.data.student));
                setStudent(response.data.student);
                setIsLoginOpen(false);
                navigate("/student-homepage");
            } else if (uniqueCode.length === 8) {
                response = await axios.post("http://localhost:5000/api/employee/employee-login", { empId: uniqueCode, password });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("employee", JSON.stringify(response.data.employee));
                setEmployee(response.data.employee);
                setIsLoginOpen(false);
                navigate("/placement-homepage");
            } else {
                setError("Unique Code should be 10 digits for admin, 7 digits for student, or 8 digits for employee.");
                return;
            }
        } catch (err) {
            setError("Invalid Unique Code or Password!");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setAdmin(null);
        setStudent(null);
        setEmployee(null);
        navigate("/");
    };

    return (
        <header className="bg-gray-700 text-white fixed top-0 w-full shadow-lg z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img src={logo} alt="College" className="h-10 w-auto" />
                </Link>

                {/* Navigation for Desktop */}
                <nav className="hidden md:flex space-x-8 text-lg">
                    <Link to="/" className="hover:text-gray-300 transition">Home</Link>
                    <Link to="/about" className="hover:text-gray-300 transition">About Us</Link>
                    <Link to="/contact" className="hover:text-gray-300 transition">Contact Us</Link>
                    <Link to="/services" className="hover:text-gray-300 transition">Services</Link>
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu size={28} />
                </button>

                {/* Infrastructure Button */}
                <button
                    className="hidden md:block bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-600 transition"
                    onClick={() => window.open("https://youtu.be/gocu_CDPD0w?si=oQwmhcT1-17huDew", "_blank")}
                >
                    AGC INFRASTRUCTURE
                </button>

                {/* Login / Logout Button */}
                {!admin && !student && !employee ? (
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                        onClick={() => setIsLoginOpen(true)}
                    >
                        Login
                    </button>
                ) : (
                    <button
                        className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-red-600 transition"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-gray-800 text-white text-lg flex flex-col space-y-4 p-4">
                    <Link to="/" className="hover:text-gray-400">Home</Link>
                    <Link to="/about" className="hover:text-gray-400">About Us</Link>
                    <Link to="/contact" className="hover:text-gray-400">Contact Us</Link>
                    <Link to="/services" className="hover:text-gray-400">Services</Link>
                </div>
            )}

            {/* Login Modal */}
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => setIsLoginOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Login</h2>
                        <div className="flex items-center border-2 border-gray-400 focus-within:border-blue-500 rounded-md mb-3 p-2 bg-gray-100">
                            <User size={20} className="text-gray-700 mr-2" />
                            <input
                                type="text"
                                placeholder="UserId"
                                value={uniqueCode}
                                onChange={(e) => setUniqueCode(e.target.value)}
                                className="w-full outline-none bg-transparent text-lg text-black placeholder-gray-500"
                            />
                        </div>
                        <div className="flex items-center border-2 border-gray-400 focus-within:border-blue-500 rounded-md mb-4 p-2 bg-gray-100">
                            <Lock size={20} className="text-blue-600 mr-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full outline-none bg-transparent text-lg text-black placeholder-gray-500"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <button
                            className="bg-blue-600 text-white px-5 py-3 text-lg rounded-lg font-bold shadow-md w-full hover:bg-blue-700 transition flex justify-center items-center"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
