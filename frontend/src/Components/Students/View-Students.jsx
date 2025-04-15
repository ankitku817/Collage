import React, { useState, useEffect } from "react";
import axios from "axios";

function View_Student() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/student/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
      } catch (error) {
        setError("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p className="text-center text-lg text-blue-500 font-semibold">🔄 Loading students...</p>;
  if (error) return <p className="text-center text-red-600 font-bold">❌ {error}</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">🎓 Student List</h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600 font-semibold text-lg">❌ No students found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, index) => (
            <div key={student._id || index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-6 border border-gray-200">
              <img
                src={student.profileImage || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-blue-400"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-800">📌 {student.name}</h2>
                <p className="text-base font-bold text-blue-950">{student.headline}</p>
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

export default View_Student;
