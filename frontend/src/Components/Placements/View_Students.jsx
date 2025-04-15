import React, { useState, useEffect } from "react";
import axios from "axios";

function View_Students() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/employee/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
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
        (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.rollcode && student.rollcode.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter((student) => student.course === selectedCourse);
    }

    if (selectedDepartment) {
      filtered = filtered.filter((student) => student.department === selectedDepartment);
    }

    setFilteredStudents(filtered);
  }, [searchQuery, selectedCourse, selectedDepartment, students]);

  if (loading) return <p className="text-center text-lg text-blue-500 font-semibold">🔄 Loading students...</p>;
  if (error) return <p className="text-center text-red-600 font-bold">❌ {error}</p>;

  // Get unique course & department options for filters
  const uniqueCourses = [...new Set(students.map((s) => s.course))];
  const uniqueDepartments = [...new Set(students.map((s) => s.department))];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">🎓 Student List</h1>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 justify-between items-center mb-6 border border-gray-200">
        <input
          type="text"
          placeholder="🔍 Search by Name or Roll No..."
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 w-full md:w-1/3 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 w-full md:w-1/4 shadow-sm"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">📚 Filter by Course</option>
          {uniqueCourses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>

        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 w-full md:w-1/4 shadow-sm"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">🏢 Filter by Department</option>
          {uniqueDepartments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-600 font-semibold text-lg">❌ No students match the criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <div key={student._id || index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-6 border border-gray-200">
              <img
                src={student.profileImage || "https://via.placeholder.com/100"} // Placeholder if no image
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-blue-400"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-800">📌 {student.name}</h2>
                <p className="text-base font-bold text-blue-950"> {student.headline}</p>
                <p className="text-gray-600"><strong>🎟️ Roll No:</strong> {student.rollcode}</p>
                <p className="text-gray-600"><strong>📚 Semester:</strong> {student.semester}</p>
                <p className="text-gray-600"><strong>🎓 Batch:</strong> {student.batchYear} - {student.passoutYear}</p>
                <p className="text-gray-600"><strong>📖 Course:</strong> {student.course}</p>
                <p className="text-gray-600"><strong>🏛️ Department:</strong> {student.department}</p>
                <p className="text-gray-600"><strong>🏫 College:</strong> {student.collegeName}</p>
                <p className="text-gray-600"><strong>📧 Email:</strong> {student.emailId}</p>
                <p className="text-gray-600"><strong>📞 Phone:</strong> {student.countryCode} {student.mobileNo}</p>
                <p className="text-gray-600"><strong>🎂 Date Of Birth:</strong> {new Date(student?.dateOfBirth).toLocaleDateString()}</p>
                <p className="text-gray-600"><strong>📍 City:</strong> {student.city}, {student.state}, {student.country}</p>
                <p className="text-gray-600"><strong>🧑 Gender:</strong> {student.Gender}</p>
                <p className="text-gray-600"><strong>👨‍👩‍👧 Father:</strong> {student.fathersname}</p>
                <p className="text-gray-600"><strong>💡 Skills:</strong> {student.skills.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default View_Students;
