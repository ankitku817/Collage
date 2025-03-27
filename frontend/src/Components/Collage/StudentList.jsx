import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaEdit, FaTrash } from "react-icons/fa"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faUserGraduate,
    faPhone,
    faEnvelope,
    faCalendarAlt,
    faVenusMars,
    faUniversity,
    faMapMarkerAlt,
    faUpload,
} from "@fortawesome/free-solid-svg-icons";
const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState({
        countryCode: "+91",
        mobileNo: ""
    });
    const [mobileError, setMobileError] = useState("");
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
    const [states, setStates] = useState([]);
    const stateData = {
        India: [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
            "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
            "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
            "West Bengal"],
        Nepal: [
            "Bagmati", "Gandaki", "Karnali", "Koshi", "Lumbini",
            "Madhesh", "Sudurpashchim"
        ],
    };
    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setStates(stateData[selectedCountry] || []);
        handleInputChange(e);
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
    const [pinCodeError, setPinCodeError] = useState("");
    const validatePinCode = (pinCode) => {
        const pinCodePattern = /^[1-9][0-9]{5}$/; 
        if (!pinCode) {
            setPinCodeError("Pin Code is required.");
        } else if (!pinCodePattern.test(pinCode)) {
            setPinCodeError("Enter a valid 6-digit Pin Code.");
        } else {
            setPinCodeError("");
        }
    };
    const [emailError, setEmailError] = useState("");
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Email is required.");
        } else if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };
    const handleMobileChange = (e) => {
        const { value } = e.target;
        const countryCode = editStudent.countryCode;
        const mobileLengths = {
            "+91": 10, 
            "+1": 10, 
            "+44": 10, 
            "+61": 9,  
            "+81": 10, 
            "+33": 9,  
            "+49": 11, 
            "+86": 11 
        };
        const length = mobileLengths[countryCode] || 10;
        if (!/^\d*$/.test(value)) {
            setMobileError("Only numeric digits are allowed.");
        } else if (value.length > length) {
            setMobileError(`Mobile number should be exactly ${length} digits.`);
        } else if (value.length < length) {
            setMobileError(`Mobile number should be exactly ${length} digits.`);
        } else {
            setMobileError("");
        }
        setEditStudent((prev) => ({ ...prev, mobileNo: value }));
    };
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
        const message = encodeURIComponent("Hello, this is an important message from the admin.");
        window.open(`https://wa.me/${mobileNo}?text=${message}`, "_blank");
    };
    const handleDeleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/students/${id}`);
            setStudents(students.filter((student) => student._id !== id));
        } catch (err) {
            alert("Failed to delete student.");
        }
    };

    const handleEditStudent = (student) => {
        setEditStudent({
            _id: student._id
        });
        setEditStudent(student);

        setIsEditModalOpen(true);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditStudent((prev) => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        console.log("Updating Student:", editStudent); 
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/admin/students/update/${editStudent._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editStudent), 
            });

            const data = await response.json();
            console.log("API Response:", data); 

            if (response.ok) {
                alert("Student updated successfully!");
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student._id === editStudent._id ? { ...student, ...data.student } : student
                    )
                );

                setIsEditModalOpen(false);
            } else {
                alert(data.error || "Failed to update student.");
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student.");
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditStudent((prev) => ({ ...prev, [name]: value }));
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
            </div>
            <ul className="space-y-4">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <li key={student._id} className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-xl font-semibold">Roll Code: {student.rollcode}</h3>
                            <p>Name: {student.name}</p>
                            <p>Department: {student.department || "N/A"}</p>
                            <p>Registered On: {new Date(student.createdAt).toLocaleDateString()}</p>
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => handleSendMessage(student.mobileNo)}
                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <FaPaperPlane className="mr-1" /> Send
                                </button>
                                <button
                                    onClick={() => handleEditStudent(student)}
                                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 flex items-center"
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 flex items-center"
                                >
                                    <FaTrash className="mr-1" /> Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No students found.</p>
                )}
            </ul>
            {isEditModalOpen && editStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
                        <h2 className="text-2xl mb-4 text-center font-bold text-gray-800">
                            ✏️ Edit Student
                        </h2>
                        <div className="flex flex-col mb-4">
                            <label className="font-medium text-gray-700">📜 Roll Code:</label>
                            <input
                                type="text"
                                value={editStudent?.rollcode || ""}
                                disabled
                                className="border p-2 w-full rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                            <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">👤 Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editStudent?.name || ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">👨‍👦 Father's Name</label>
                                    <input
                                        type="text"
                                        name="fathersname"
                                        value={editStudent?.fathersname || ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">🏫 College Roll No</label>
                                    <input
                                        type="text"
                                        name="collageRollNo"
                                        value={editStudent?.collageRollNo || ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                        required
                                        maxLength={7}
                                        pattern="\d{7}"
                                        title="Must be exactly 7 digits"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">🏫 College Name</label>
                                    <input
                                        type="text"
                                        value="Amritsar Group Of Colleges, Amritsar, Punjab"
                                        className="border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">📚 Course</label>
                                    <select
                                        name="course"
                                        value={editStudent?.course || ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        <optgroup label="Graduation">
                                            <option value="B.Tech">B.Tech</option>
                                            <option value="B.Com">B.Com</option>
                                            <option value="B.Sc">B.Sc</option>
                                            <option value="BBA">BBA</option>
                                            <option value="BCA">BCA</option>
                                            <option value="BA">BA</option>
                                            <option value="Hotel Management">Hotel Management</option>
                                        </optgroup>
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
                                <div className="flex flex-col ">
                                    <label className="font-medium">Department</label>
                                    <select
                                        name="department"
                                        value={editStudent?.department || ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {courseDepartments[editStudent?.course]?.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={editStudent.dateOfBirth ? editStudent.dateOfBirth.split("T")[0] : ""}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded-lg"
                                    required
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 19))
                                        .toISOString()
                                        .split("T")[0]}
                                />
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">🚻 Gender</label>
                                    <select
                                        name="Gender"
                                        value={editStudent?.Gender || ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">♂️ Male</option>
                                        <option value="Female">♀️ Female</option>
                                        <option value="Other">⚧ Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">📱 Mobile Number</label>
                                    <div className="flex">
                                        <select
                                            name="countryCode"
                                            value={editStudent?.rollcode || ""}
                                            onChange={handleInputChange}
                                            className="border p-2 rounded-l-lg bg-gray-100"
                                        >
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+61">🇦🇺 +61</option>
                                            <option value="+81">🇯🇵 +81</option>
                                            <option value="+33">🇫🇷 +33</option>
                                            <option value="+49">🇩🇪 +49</option>
                                            <option value="+86">🇨🇳 +86</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="mobileNo"
                                            value={editStudent.mobileNo || ""}
                                            onChange={handleMobileChange}
                                            placeholder="Enter mobile number"
                                            className="border p-2 rounded-r-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                    {mobileError && <span className="text-red-500 text-sm">{mobileError}</span>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700">📧 Email ID</label>
                                    <input
                                        type="email"
                                        name="emailId"
                                        value={editStudent.emailId || ""}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateEmail(e.target.value)}
                                        className={`border p-2 rounded-lg w-full ${emailError ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-medium">Country</label>
                                    <select
                                        name="country"
                                        value={editStudent.country || ""}
                                        onChange={handleCountryChange}
                                        className="border p-2 rounded-lg w-full"
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        <option value="India">India</option>
                                        <option value="Nepal">Nepal</option>
                                    </select>
                                </div>
                        <div className="flex flex-col">
                            <label className="font-medium">State</label>
                                    <select
                                        name="state"
                                        value={editStudent?.state ?? ""}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded-lg w-full"
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state, index) => (
                                            <option key={index} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>

                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={editStudent.city || ""}
                                onChange={handleInputChange}
                                className="border p-2 rounded-lg w-full"
                                required
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="font-medium">Profile Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="border p-2 rounded-lg"
                            />
                        </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                    >
                                        ❌ Cancel
                                    </button>
                                    <button type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        ✅ Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
)};
export default StudentList;
