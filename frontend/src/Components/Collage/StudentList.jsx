import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa"; // Import send icon

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const courseDepartments = {
        "B.Tech": ["CSE", "ME", "EE", "CE", "ECE", "IT"],
        "M.Tech": ["CSE", "ME", "EE", "CE", "ECE", "IT"],
        "B.Com": ["Accounting", "Finance", "Taxation"],
        "M.Com": ["Accounting", "Finance", "Business Studies"],
        "B.Sc": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "M.Sc": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "BBA": ["Marketing", "Finance", "Human Resources"],
        "MBA": ["Marketing", "Finance", "HR", "Operations Management"],
        "BCA": ["Software Development", "Data Analytics"],
        "MCA": ["Software Engineering", "Data Science"],
        "BA": ["English", "History", "Political Science"],
        "MA": ["English", "History", "Political Science"],
        "Hotel Management": ["Hospitality Management", "Food Production"],
        "PGDM": ["Business Analytics", "Marketing", "Finance"],
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/admin/students", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(response.data);
                setFilteredStudents(response.data);
            } catch {
                setError("Failed to fetch students.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        let filtered = students;
        if (searchQuery) {
            filtered = filtered.filter((student) =>
                student.rollcode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCourseFilter) {
            filtered = filtered.filter((student) => student.course === selectedCourseFilter);
        }
        if (departmentFilter) {
            filtered = filtered.filter((student) => student.department === departmentFilter);
        }
        setFilteredStudents(filtered);
    }, [searchQuery, selectedCourseFilter, departmentFilter, students]);

    const handleSendMessage = (mobileNo) => {
        // Example: Open WhatsApp or SMS app with a pre-filled message
        const message = encodeURIComponent("Hello, this is an important message from the admin.");
        window.open(`https://wa.me/${mobileNo}?text=${message}`, "_blank"); // WhatsApp
        // window.open(`sms:${mobileNo}?body=${message}`); // SMS (uncomment to use SMS instead)
    };

    if (loading) return <p>Loading students...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Registered Students</h2>
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by Roll Code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                />
                <select
                    value={selectedCourseFilter}
                    onChange={(e) => {
                        setSelectedCourseFilter(e.target.value);
                        setDepartmentFilter("");
                    }}
                    className="border p-2 rounded-lg"
                >
                    <option value="">All Courses</option>
                    {Object.keys(courseDepartments).map((course) => (
                        <option key={course} value={course}>{course}</option>
                    ))}
                </select>
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="border p-2 rounded-lg"
                    disabled={!selectedCourseFilter}
                >
                    <option value="">All Departments</option>
                    {selectedCourseFilter && courseDepartments[selectedCourseFilter]?.map((department) => (
                        <option key={department} value={department}>{department}</option>
                    ))}
                </select>
            </div>
            <ul className="space-y-4">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <li key={student._id} className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-xl font-semibold">Roll Code: {student.rollcode}</h3>
                            <p>Department: {student.department || "N/A"}</p>
                            <p>Registered On: {new Date(student.createdAt).toLocaleDateString()}</p>
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-semibold">Mobile No.: {student.mobileNo}</h4>
                                <button
                                    onClick={() => handleSendMessage(student.mobileNo)}
                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <FaPaperPlane className="mr-1" /> Send
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No students found.</p>
                )}
            </ul>
        </div>
    );
};

export default StudentList;
