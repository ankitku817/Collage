import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/agc-logo.png";
import { UserCircle, LogOut, X, User, Lock, Loader2 } from "lucide-react";
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
    const navigate = useNavigate();
    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        const storedStudent = localStorage.getItem("student");
        const storedEmployee = localStorage.getItem("employee");
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        }
        if (storedEmployee) {
            setEmployee(JSON.parse(storedEmployee)); 
        }
    }, []);
    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            let response;
            if (uniqueCode.length === 10) {
                response = await axios.post("http://localhost:5000/api/admin/login", {
                    uniqueCode,
                    password,
                });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("admin", JSON.stringify(response.data.admin));
                setAdmin(response.data.admin);
                setIsLoginOpen(false); 
                navigate("/collage-homepage");

            } else if (uniqueCode.length === 7) {
                response = await axios.post("http://localhost:5000/api/student/login-student", {
                    rollcode: uniqueCode,
                    password,
                });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("student", JSON.stringify(response.data.student));
                setStudent(response.data.student);
                setIsLoginOpen(false); 
                navigate("/student-homepage");

            } else if (uniqueCode.length === 8) {
                response = await axios.post("http://localhost:5000/api/admin/employee-login", {
                    empId: uniqueCode,
                    password,
                });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("employee", JSON.stringify(response.data.employee));
                setEmployee(response.data.employee);
                setIsLoginOpen(false); 
                navigate("/employee-homepage");
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
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("student");  
        localStorage.removeItem("employee"); 
        setAdmin(null);
        setStudent(null);
        setEmployee(null);
        navigate("/");
    };    
    const getProfileLink = () => {
        if (uniqueCode.length === 10) {
            return { path: "/collage-homepage/profile", label: "Profile" };
        } else if (uniqueCode.length === 7) {
            return { path: "/student-homepage/profile", label: "Profile" };
        } else if (uniqueCode.length === 8) {
            return { path: "/employee-homepage/profile", label: "Profile" };
        }
        return null;
    };
    const profile = getProfileLink();
    return (
        <header className="bg-gray-400 text-white fixed top-0 w-full shadow-lg z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
                    <img src={logo} alt="College" className="h-10 w-auto" />
                </Link>
                <nav className="hidden md:flex space-x-12 text-lg">
                    <Link to="/" className="hover:text-gray-200 transition font-extrabold">Home</Link>
                    <Link to="/about" className="hover:text-gray-200 transition font-extrabold">About Us</Link>
                    <Link to="/contact" className="hover:text-gray-200 transition font-extrabold">Contact Us</Link>
                    <Link to="/services" className="hover:text-gray-200 transition font-extrabold">Services</Link>
                </nav>
                <button
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-600 transition"
                    onClick={() => window.open("https://youtu.be/gocu_CDPD0w?si=oQwmhcT1-17huDew", "_blank")}
                >
                    AGC INFRASTRUCTURE
                </button>        
            
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
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => setIsLoginOpen(false)}
                        >
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