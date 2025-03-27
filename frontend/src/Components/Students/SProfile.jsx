import { useEffect, useState } from "react";
import axios from "axios";

const SProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState(null);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/student/students-profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudent(response.data);
                setEditedStudent(response.data);
            } catch (err) {
                setError("Failed to fetch student profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/api/student/update-profile", editedStudent, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStudent(editedStudent);
            setIsEditing(false);
        } catch (error) {
            setError("Failed to update profile.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Student Profile</h2>
            {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col">
                        <label className="font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        />
                    </div>
                    {/* 👨‍👦 Father's Name */}
                    <div className="flex flex-col">
                        <label className="font-medium">Father's Name</label>
                        <input
                            type="text"
                            name="fathersname"
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        />
                    </div>

                    {/* 🔢 College Roll No */}
                    <div className="flex flex-col">
                        <label className="font-medium">College Roll No</label>
                        <input
                            type="text"
                            name="collageRollNo"
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        />
                    </div>

                    {/* 🏫 College Name */}
                    <div className="flex flex-col">
                        <label className="font-medium">College Name</label>
                        <input
                            type="text"
                            name="collageName"
                            value="Amritsar Group Of Colleges, Amritsar, Punjab"
                            className="border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                            readOnly
                        />
                    </div>
                    {/* 🎂 Date of Birth */}
                    <div className="flex flex-col">
                        <label className="font-medium">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        />
                    </div>

                    {/* 🚻 Gender */}
                    <div className="flex flex-col">
                        <label className="font-medium">Gender</label>
                        <select
                            name="Gender"
                                                        onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* 📱 Mobile No with Country Code */}
                    <div className="flex flex-col">
                        <label className="font-medium">Mobile Number</label>
                        <div className="flex">
                            <select
                                name="countryCode"
                                onChange={handleInputChange}
                                className="border p-2 rounded-l-lg"
                            >
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                {/* Add more country codes if needed */}
                            </select>
                            <input
                                type="text"
                                name="mobileNo"
                                
                                onChange={handleInputChange}
                                className="border p-2 rounded-r-lg w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* 📧 Email ID */}
                    <div className="flex flex-col">
                        <label className="font-medium">Email ID</label>
                        <input
                            type="email"
                            name="emailId"
                            
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        />
                    </div>


                    {/* 📚 Course */}
                    <div className="flex flex-col">
                        <label className="font-medium">Course</label>
                        <select
                            name="course"
                           
                            onChange={(e) => {
                                handleInputChange(e);
                                setSelectedStudent((prev) => ({
                                    ...prev,
                                    department: "" // Reset department when course changes
                                }));
                            }}
                            className="border p-2 rounded-lg"
                            required
                        >
                            <option value="">Select Course</option>

                            {/* Graduation Courses */}
                            <optgroup label="Graduation">
                                <option value="B.Tech">B.Tech</option>
                                <option value="B.Com">B.Com</option>
                                <option value="B.Sc">B.Sc</option>
                                <option value="BBA">BBA</option>
                                <option value="BCA">BCA</option>
                                <option value="BA">BA</option>
                                <option value="Hotel Management">Hotel Management</option>
                            </optgroup>

                            {/* Post-Graduation Courses */}
                            <optgroup label="Post-Graduation">
                                <option value="M.Tech">M.Tech</option>
                                <option value="MBA">MBA</option>
                                <option value="M.Com">M.Com</option>
                                <option value="M.Sc">M.Sc</option>
                                <option value="MCA">MCA</option>
                                <option value="MA">MA</option>
                                <option value="PGDM">PGDM</option>
                            </optgroup>
                        </select>
                    </div>


                    {/* 🎓 Semester */}
                    <div className="flex flex-col">
                        <label className="font-medium">Semester</label>
                        <select
                            name="semester"
                            
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        >
                            <option value="">Select Semester</option>
                            {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
                                <option key={sem} value={sem}>
                                    {sem} Semester
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* 🏢 Department */}
                    <div className="flex flex-col">
                        <label className="font-medium">Department</label>
                        <select
                            name="department"
                            
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                            disabled={!course} // Disable if no course is selected
                        >
                            <option value="">Select Department</option>
                            {course &&
                                courseDepartments[course]?.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                        </select>
                    </div>


                    {/* 🏷️ Batch */}
                    <div className="flex flex-col">
                        <label className="font-medium">Batch</label>
                        <select
                            name="batch"
                           
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        >
                            <option value="">Select Batch</option>
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-medium">Address</label>
                        <textarea
                            name="address"
                            
                            onChange={handleInputChange}
                            className="border p-2 rounded-lg"
                            required
                        />
                    </div>

                    {/* 🖼️ Profile Image Upload */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-medium">Profile Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="border p-2 rounded-lg"
                        />
                    </div>
                </div>

                
            ) : (
                <div>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Father's Name:</strong> {student.fathersname}</p>
                    <p><strong>Email:</strong> {student.emailId}</p>
                    <p><strong>Address:</strong> {student.address}</p>
                </div>
            )}
            <div className="mt-4">
                {isEditing ? (
                    <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save Changes</button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg">Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default SProfile;