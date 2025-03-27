import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaUniversity, FaBirthdayCake, FaMapMarkerAlt, FaCodeBranch, FaBook } from "react-icons/fa"; // Importing icons

const SProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/student/students-profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(response.data);
            } catch (err) {
                setError("Failed to fetch student profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, []);

    if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">🎓 Student Profile</h2>

            <div className="flex items-center justify-center mb-6">
                <img
                    // src={`http://localhost:5000/uploads/${student.profileImage}`}
                    src={student.profileImage}
                    alt="Profile"
                    className="rounded-full border-4 border-blue-500 w-24 h-24"
                />
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
                {/* Name */}
                <div className="flex items-center">
                    <FaUser className="text-blue-500 mr-2" />
                    <p><strong>Name:</strong> {student?.name}</p>
                </div>

                {/* Father's Name */}
                <div className="flex items-center">
                    <FaUser className="text-green-500 mr-2" />
                    <p><strong>Father's Name:</strong> {student?.fathersname}</p>
                </div>

                {/* Mobile No */}
                <div className="flex items-center">
                    <FaPhone className="text-purple-500 mr-2" />
                    <p><strong>Mobile:</strong> {student?.countryCode} {student?.mobileNo}</p>
                </div>

                {/* Email */}
                <div className="flex items-center">
                    <FaEnvelope className="text-red-500 mr-2" />
                    <p><strong>Email:</strong> {student?.emailId}</p>
                </div>

                {/* College */}
                <div className="flex items-center">
                    <FaUniversity className="text-indigo-500 mr-2" />
                    <p><strong>College:</strong> {student?.collegeName}</p>
                </div>

                {/* Roll No */}
                <div className="flex items-center">
                    <FaBook className="text-yellow-500 mr-2" />
                    <p><strong>College Roll No:</strong> {student?.collageRollNo}</p>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center">
                    <FaBirthdayCake className="text-pink-500 mr-2" />
                    <p><strong>DOB:</strong> {new Date(student?.dateOfBirth).toLocaleDateString()}</p>
                </div>

                {/* Gender */}
                <div className="flex items-center">
                    <p><strong>Gender:</strong> {student?.Gender === "Male" ? "👨" : student?.Gender === "Female" ? "👩" : "⚧️"} {student?.Gender}</p>
                </div>

                {/* Course */}
                <div className="flex items-center">
                    <FaCodeBranch className="text-orange-500 mr-2" />
                    <p><strong>Course:</strong> {student?.course}</p>
                </div>

                {/* Department */}
                <div className="flex items-center">
                    <FaBook className="text-green-600 mr-2" />
                    <p><strong>Department:</strong> {student?.department}</p>
                </div>

                {/* Location */}
                <div className="flex items-center col-span-2">
                    <FaMapMarkerAlt className="text-red-600 mr-2" />
                    <p><strong>Address:</strong> {student?.city}, {student?.state}, {student?.country}</p>
                </div>
            </div>

            <div className="text-center mt-6">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Edit Profile ✏️</button>
            </div>
        </div>
    );
};

export default SProfile;
