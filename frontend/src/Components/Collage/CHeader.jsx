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

const CHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStudentRegisterOpen, setIsStudentRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlacementRegisterOpen, setIsPlacementRegisterOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [uniqueCode, setUniqueCode] = useState("");
  const [password, setPassword] = useState("");
  const [empId, setEmpId] = useState("");
  const [rollcode, setRollCode] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Request OTP for password change
  const handleRequestOTP = async () => {
    try {
      if (!uniqueCode) {
        setError("Please enter your unique code.");
        return;
      }

      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/request-password-change",
        {
          uniqueCode
        }
      );

      setOtpSent(true);
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Password Change
  const handleChangePassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/change-password",
        {
          uniqueCode,
          otp,
          newPassword
        }
      );

      setMessage(response.data.message);
      setIsChangePasswordOpen(false);
      setError("");
      navigate("/login");
    } catch (err) {
      setError("Invalid OTP or failed to change password.");
    } finally {
      setLoading(false);
    }
  };


  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }
    if (!rollcode || !password || !mobileNo) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    let rawNumber = mobileNo.replace(/\D/g, "");
    if (rawNumber.length > 10) {
      rawNumber = rawNumber.slice(-10);
    }
    if (rawNumber.length !== 10) {
      setError("Invalid mobile number! It must be exactly 10 digits.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-students",
        {
          rollcode: rollcode,
          password,
          mobileNo: rawNumber, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Student registered successfully!");
      setTimeout(() => {
        setMessage("");
        setRollCode("");
        setPassword("");
        setMobileNo("");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  const handlePlacementRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    if (!empId || !password || !mobileNo) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    let rawNumber = mobileNo.replace(/\D/g, "");
    if (rawNumber.length > 10) {
      rawNumber = rawNumber.slice(-10);
    }
    if (rawNumber.length !== 10) {
      setError("Invalid mobile number! It must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/register-employee",
        {
          empId: empId,
          password,
          mobileNo: rawNumber, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeout(() => {
        setMessage("");
        setEmpId("");
        setPassword("");
        setMobileNo("");
      }, 2000);
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <div
        className={`fixed top-0 left-0 h-full w-72 mt-32 bg-gray-300 shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 z-50`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold ml-9">Menu</h1>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <ul className="p-4 space-y-4 font-extrabold">
          <Link to="/collage-homepage/profile">
            <li className="flex items-center gap-5 cursor-pointer text-xl hover:text-blue-600">
              <FaUser className="text-blue-600" /> View Profile
            </li>
          </Link>
          <hr/>
          <Link to="/collage-homepage/students">
            <li className="flex items-center gap-5 cursor-pointer text-xl hover:text-blue-600">
              <FaUsers className="text-blue-600" /> Registered Students
            </li>
          </Link>
          <hr />
          <Link to="/collage-homepage/employees">
            <li className="flex items-center gap-5 cursor-pointer text-xl hover:text-blue-600">
              <FaBriefcase className="text-blue-600" />  Placement Admin
            </li>
          </Link>
          <hr />
          <Link to="/collage-homepage/feedback-response">
            <li className="flex items-center gap-5 cursor-pointer text-xl hover:text-blue-600">
              <FaChartBar className="text-blue-600" /> Feedback
            </li>
          </Link>
          <hr />
          <Link to="/collage-homepage/policy">
            <li className="flex items-center gap-5 cursor-pointer text-xl hover:text-blue-600">
              <FaBook className="text-blue-600" /> Policy
            </li>
          </Link>
          <hr/>
        </ul>
      </div>

      <header
        style={{ marginTop: "72px" }}
        className="fixed top-0 w-full bg-blue-600 text-white py-4 shadow-lg z-50"
      >
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl"
          >
            <FaBars />
          </button>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <FaUniversity className="text-2xl md:text-3xl" />
            <span className="hidden sm:inline">College Placement System</span>
          </h1>
          <div className="hidden md:flex gap-4">
            <button className="hover:text-gray-200 transition" onClick={()=> setIsStudentRegisterOpen(true)}>
              Register Students
            </button>
            <button className="hover:text-gray-200 transition" onClick={()=> setIsPlacementRegisterOpen(true)}>
              Placement Admin
            </button>
            <button className="hover:text-gray-200 transition" onClick={() => setIsChangePasswordOpen(true)}>
              Change Password
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden relative">
            <button
              className="text-2xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-blue-600 shadow-lg rounded-lg py-2 w-48">
                <button className="block w-full text-left px-4 py-2 hover:bg-blue-100">
                  Register Students
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-blue-100">
                  Placement Admin
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-blue-100">
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </header>          
{
  isChangePasswordOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        {!otpSent ? (
          <>
            <input
              type="text"
              placeholder="Enter Unique Code"
              className="w-full p-2 border rounded mb-4"
              value={uniqueCode}
              onChange={(e) => setUniqueCode(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white w-full p-2 rounded"
              onClick={handleRequestOTP}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="bg-green-600 text-white w-full p-2 rounded"
              onClick={handleChangePassword}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </>
        )}
        <button
          className="mt-2 text-red-500 hover:underline"
          onClick={() => setIsChangePasswordOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
{
        isStudentRegisterOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                onClick={() => setIsStudentRegisterOpen(false)}
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-blue-600 mb-4">Register Student</h2>

              <form onSubmit={handleStudentRegister}>
                <div className="flex items-center border-2 rounded-md mb-3 p-2">
                  <User size={20} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="UNI. Roll Code"
                    value={rollcode}
                    onChange={(e) => setRollCode(e.target.value)}
                    maxLength={7}
                    className="w-full outline-none bg-transparent text-lg"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="flex items-center border-2 rounded-md mb-4 p-2">
                  <Lock size={20} className="text-gray-500 mr-2" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={20}
                    className="w-full outline-none bg-transparent text-lg"
                    required
                  />
                </div>

                {/* Mobile Number Input with Country Code */}
                <div className="flex items-center border-2 rounded-md mb-4 p-2">
                  <PhoneInput
                    country={"in"} // Default country (India)
                    value={mobileNo}
                    onChange={setMobileNo}
                    inputClass="w-full text-lg outline-none bg-transparent"
                    containerClass="w-full"
                    inputStyle={{ width: "100%", border: "none", fontSize: "1rem" }}
                    buttonStyle={{ border: "none" }}
                    required
                  />
                </div>

                {/* Error & Success Messages */}
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg w-full hover:bg-blue-700 transition flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Register"}
                </button>
              </form>
            </div>
          </div>
        )
}

{
  isPlacementRegisterOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={() => setIsPlacementRegisterOpen(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-blue-600 mb-4">Register Employee</h2>

        <form onSubmit={handlePlacementRegister}>
          <div className="flex items-center border-2 rounded-md mb-3 p-2">
            <User size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Employee ID"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              maxLength={8}
              className="w-full outline-none bg-transparent text-lg"
              required
            />
          </div>
          <div className="flex items-center border-2 rounded-md mb-4 p-2">
            <Lock size={20} className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none bg-transparent text-lg"
              required
            />
                </div>
                {/* Mobile Number Input with Country Code */}
            <div className="flex items-center border-2 rounded-md mb-4 p-2">
                  <PhoneInput
                    country={"in"} // Default country (India)
                    value={mobileNo}
                    onChange={setMobileNo}
                    inputClass="w-full text-lg outline-none bg-transparent"
                    containerClass="w-full"
                    inputStyle={{ width: "100%", border: "none", fontSize: "1rem" }}
                    buttonStyle={{ border: "none" }}
                    required
                  />
                </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg w-full hover:bg-blue-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
      }
      <main className="pt-32 px-4">
        <section className="text-center py-0">
          
          
        </section>
      </main>
    </div>
    );
};
export default CHeader;