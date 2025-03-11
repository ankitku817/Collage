import { useEffect, useState } from "react";
import axios from "axios";

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
                console.log(response.data);
            } catch (err) {
                setError("Failed to fetch student profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-container">
            <h2>Student Profile</h2>
            <p><strong>Roll Number:</strong> {student.rollcode}</p>
            <p><strong>Name:</strong> {student.name || "N/A"}</p>
            <p><strong>Email:</strong> {student.email || "N/A"}</p>
            <p><strong>Department:</strong> {student.department || "N/A"}</p>
            <p><strong>CGPA:</strong> {student.cgpa || "N/A"}</p>
        </div>
    );
};

export default SProfile;