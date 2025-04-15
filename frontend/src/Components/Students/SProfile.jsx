import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaUniversity, FaBirthdayCake, FaMapMarkerAlt, FaCodeBranch, FaBook, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";

const SProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        headline: "",
        workExperience: "",
        currentCompany: "",
        skills: [],
    });
    const [filteredHeadlines, setFilteredHeadlines] = useState([]);
    const [isCustomHeadline, setIsCustomHeadline] = useState(false);

    const headlineOptions = [
        "Software Development: Full Stack Developer",
        "Backend Developer",
        "Frontend Developer",
        "Java Developer",
        "Python Developer",
        ".NET Developer",
        "PHP Developer",
        "Mobile App Developer (iOS, Android)",
        "C++ Developer",
        "JavaScript Developer (React, Angular, Vue.js)",
        "Software Engineer (Test/QA)",
        "Game Developer",
        "Web Development: Web Developer (Frontend, Backend)",
        "MERN Stack Developer (MongoDB, Express.js, React.js, Node.js)",
        "MEAN Stack Developer (MongoDB, Express.js, Angular, Node.js)",
        "WordPress Developer",
        "UI/UX Designer",
        "E-commerce Developer (Shopify, Magento, WooCommerce)",
        "Data Science & Analytics: Data Scientist",
        "Data Analyst",
        "Data Engineer",
        "Machine Learning Engineer",
        "AI Developer",
        "Data Visualization Specialist",
        "Deep Learning Engineer",
        "Business Intelligence Analyst",
        "Cybersecurity: Cybersecurity Analyst",
        "Information Security Manager",
        "Ethical Hacker (Penetration Tester)",
        "Cloud Solutions Architect",
        "Cloud Engineer (AWS, Azure, GCP)",
        "DevOps Engineer",
        "Cloud Security Engineer",
        "Networking: Network Engineer",
        "Network Administrator",
        "Blockchain Developer",
        "Blockchain Engineer",
        "Game Developer (Unity, Unreal Engine)",
        "DevOps Engineer",
        "IT Project Manager",
        "Product Manager (Tech)",
        "Blockchain Solutions Architect",
        "Quantum Computing Researcher",
        "Augmented Reality (AR) Developer",

        // Software Development headlines
        "Software Development: Full Stack Developer",
        "Backend Developer",
        "Frontend Developer",
        "Java Developer",
        "Python Developer",
        ".NET Developer",
        "PHP Developer",
        "Mobile App Developer (iOS, Android)",
        "C++ Developer",
        "JavaScript Developer (React, Angular, Vue.js)",
        "Software Engineer (Test/QA)",
        "Game Developer",
        "Web Development: Web Developer (Frontend, Backend)",
        "MERN Stack Developer (MongoDB, Express.js, React.js, Node.js)",
        "MEAN Stack Developer (MongoDB, Express.js, Angular, Node.js)",
        "WordPress Developer",
        "UI/UX Designer",
        "E-commerce Developer (Shopify, Magento, WooCommerce)",
        "Data Science & Analytics: Data Scientist",
        "Data Analyst",
        "Data Engineer",
        "Machine Learning Engineer",
        "AI Developer",
        "Data Visualization Specialist",
        "Deep Learning Engineer",
        "Business Intelligence Analyst",
        "Cybersecurity: Cybersecurity Analyst",
        "Information Security Manager",
        "Ethical Hacker (Penetration Tester)",
        "Cloud Solutions Architect",
        "Cloud Engineer (AWS, Azure, GCP)",
        "DevOps Engineer",
        "Cloud Security Engineer",
        "Networking: Network Engineer",
        "Network Administrator",
        "Blockchain Developer",
        "Blockchain Engineer",
        "Game Developer (Unity, Unreal Engine)",
        "DevOps Engineer",
        "IT Project Manager",
        "Product Manager (Tech)",
        "Blockchain Solutions Architect",
        "Quantum Computing Researcher",
        "Augmented Reality (AR) Developer",

        // Hotel Management headlines
        "Hotel Manager",
        "Hospitality Manager",
        "Food and Beverage Manager",
        "Front Office Supervisor",
        "Event Coordinator",
        "Executive Chef",
        "Restaurant Manager",
        "Housekeeping Manager",
        "Catering Sales Manager",
        "Spa and Wellness Manager",

        // Pharmacy headlines
        "Pharmacist",
        "Pharmaceutical Sales Representative",
        "Drug Regulatory Affairs Specialist",
        "Pharmaceutical Researcher",
        "Pharmacy Technician",
        "Clinical Pharmacist",
        "Pharmacovigilance Associate",
        "Quality Control Analyst",
        "Pharmaceutical Marketing Specialist",
        "Medical Science Liaison",

        // Law headlines
        "Corporate Lawyer",
        "Criminal Defense Attorney",
        "Family Law Attorney",
        "Intellectual Property Lawyer",
        "Legal Advisor",
        "Corporate Counsel",
        "Tax Attorney",
        "Litigation Associate",
        "Paralegal",
        "Legal Consultant",

        // BCA (Bachelor of Computer Applications) headlines
        "Software Developer",
        "Web Developer",
        "Database Administrator",
        "Network Administrator",
        "Data Analyst",
        "IT Support Specialist",
        "System Administrator",
        "Technical Support Engineer",
        "Cloud Computing Specialist",
        "Cybersecurity Analyst",

        // ME (Master of Engineering) headlines
        "Senior Mechanical Engineer",
        "Structural Engineer",
        "Electrical Design Engineer",
        "Aerospace Engineer",
        "Manufacturing Engineer",
        "Research and Development Engineer",
        "Power Systems Engineer",
        "Robotics Engineer",
        "Thermal Systems Engineer",
        "Engineering Project Manager",

        // CE (Civil Engineering) headlines
        "Civil Site Engineer",
        "Structural Engineer",
        "Construction Manager",
        "Project Engineer",
        "Geotechnical Engineer",
        "Urban Planner",
        "Quantity Surveyor",
        "Transportation Engineer",
        "Environmental Engineer",
        "Building Inspector",

        // EE (Electrical Engineering) headlines
        "Electrical Design Engineer",
        "Control Systems Engineer",
        "Power Electronics Engineer",
        "Electrical Maintenance Engineer",
        "Energy Manager",
        "Electrical Project Manager",
        "Automation Engineer",
        "Instrumentation Engineer",
        "Renewable Energy Engineer",
        "Power Systems Engineer",

        // ECE (Electronics and Communication Engineering) headlines
        "Electronics Design Engineer",
        "Telecommunications Engineer",
        "Embedded Systems Engineer",
        "RF Engineer",
        "VLSI Engineer",
        "Communication Systems Engineer",
        "Network Engineer",
        "Signal Processing Engineer",
        "Electronics Test Engineer",
        "IoT Engineer",

        // IT (Information Technology) headlines
        "Software Developer",
        "IT Consultant",
        "Systems Analyst",
        "Network Engineer",
        "Cloud Solutions Architect",
        "IT Project Manager",
        "Security Analyst",
        "Data Scientist",
        "IT Infrastructure Manager",
        "Blockchain Developer",

        // Accounting headlines
        "Chartered Accountant (CA)",
        "Financial Analyst",
        "Tax Consultant",
        "Management Accountant",
        "Internal Auditor",
        "Forensic Accountant",
        "Accounts Payable/Receivable Clerk",
        "Bookkeeper",
        "Financial Reporting Specialist",
        "Payroll Administrator",

        // Finance headlines
        "Investment Analyst",
        "Financial Planner",
        "Risk Manager",
        "Credit Analyst",
        "Corporate Finance Analyst",
        "Portfolio Manager",
        "Financial Controller",
        "Wealth Management Advisor",
        "Treasury Manager",
        "Mergers and Acquisitions Analyst",

        // Business Studies headlines
        "Business Analyst",
        "Project Manager",
        "Operations Manager",
        "Management Consultant",
        "Marketing Manager",
        "Human Resources Manager",
        "Supply Chain Manager",
        "Product Manager",
        "Business Development Manager",
        "Sales Manager",

        // B.Sc (Bachelor of Science) - Physics, Chemistry, Mathematics, Biology headlines
        "Research Scientist (Physics)",
        "Chemist",
        "Biotechnologist",
        "Biochemist",
        "Laboratory Technician",
        "Physicist",
        "Molecular Biologist",
        "Clinical Research Associate",
        "Environmental Scientist",
        "Data Scientist (for Physics, Chemistry, and Mathematics)",

        // M.Sc (Master of Science) - Physics, Chemistry, Mathematics, Biology headlines
        "Research Associate (Physics, Chemistry, Biology)",
        "Environmental Chemist",
        "Data Analyst (Mathematics)",
        "Biophysicist",
        "Pharmaceutical Scientist",
        "Mathematical Modeler",
        "Clinical Research Scientist",
        "Geneticist",
        "Computational Biologist",
        "Forensic Scientist",

        // BBA (Bachelor of Business Administration) - Marketing, Finance, Human Resources headlines
        "Marketing Executive",
        "Brand Manager",
        "HR Generalist",
        "Financial Planner",
        "Sales Manager",
        "Business Consultant",
        "Product Manager",
        "Market Research Analyst",
        "Recruitment Consultant",
        "Operations Executive",

        // MBA (Master of Business Administration) - Marketing, Finance, HR, Operations Management headlines
        "Marketing Manager",
        "Business Consultant",
        "HR Business Partner",
        "Financial Manager",
        "Operations Manager",
        "Strategy Manager",
        "Sales Director",
        "Supply Chain Director",
        "Business Development Manager",
        "General Manager",

        // PGDM (Post Graduate Diploma in Management) - Business Analytics, Marketing, Finance headlines
        "Business Intelligence Analyst",
        "Marketing Director",
        "Financial Analyst",
        "Data Scientist (Business Analytics)",
        "Market Research Analyst",
        "Business Consultant",
        "Brand Manager",
        "Risk Management Specialist",
        "Business Development Manager",
        "Operations Manager"
    ];
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [suggestedSkills, setSuggestedSkills] = useState([]);

    const skillOptions = [
        "Communication Skills",
        "Computer Skills",
        "Team Work",
        "Team Leadership",
        "Time Management",
        "Project Management",
        "Problem Solving",
        "Critical Thinking",
        "Adaptability",
        "Programming",
        "Data Analysis",
    ];
    

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

    const handleOpenModal = () => {
        setProfileData({
            headline: student?.headline || "",
            workExperience: student?.workExperience || "",
            currentCompany: student?.currentCompany || "",
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSkillInputChange = (e) => {
        const value = e.target.value;
        setSkillInput(value);

        if (value) {
            setSuggestedSkills(
                skillOptions.filter((skill) =>
                    skill.toLowerCase().includes(value.toLowerCase())
                )
            );
        } else {
            setSuggestedSkills([]);
        }
    };

    const handleSkillSelect = (skill) => {
        if (!profileData?.skills) {
            setProfileData({ ...profileData, skills: [] });
            return; 
        }

        if (profileData.skills.length < 5 && !profileData.skills.includes(skill)) {
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, skill],
            });
        }

        setSkillInput("");
        setSuggestedSkills([]);
    };

    const handleRemoveSkill = (skill) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter((s) => s !== skill),
        });
    };
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
        if (name === "headline") {
            setIsCustomHeadline(value === "");

            if (value) {
                setFilteredHeadlines(
                    headlineOptions.filter(option =>
                        option.toLowerCase().includes(value.toLowerCase())
                    )
                );
            } else {
                setFilteredHeadlines([]);
            }
        }     
    };
    const handleSaveProfile = async () => {
        setError("");
        setSuccessMessage("");

        if (!profileData || !Array.isArray(profileData.skills)) {
            setError("Skills data is missing.");
            return;
        }

        if (profileData.skills.length < 3) {
            setError("Please add at least 3 skills.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/student/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Profile update failed!");
            }

            setSuccessMessage("Profile updated successfully!");
            setStudent(data.student); // Correct way to access the response
            setIsModalOpen(false);
        } catch (err) {
            setError(err.message || "Failed to update profile.");
        }
    };
return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-300">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">🎓 Your Profile</h2>
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <div className="flex items-center justify-center mb-8">
                <img
                    src={student.profileImage}
                    alt="Profile"
                    className="rounded-full border-4 border-blue-500 w-32 h-32"
                />
        </div> 
        <div className=" flex items-center justify-center mb-6">
        <p className="text-base font-bold text-blue-950 ">{student?.headline}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-lg">
                {/* Profile fields display */}
                <div className="flex items-center">
                    <FaUser className="text-blue-500 mr-4" />
                    <p><strong>Name:</strong> {student?.name}</p>
                </div>

                <div className="flex items-center">
                    <FaUser className="text-green-500 mr-4" />
                    <p><strong>Father's Name:</strong> {student?.fathersname}</p>
                </div>

                <div className="flex items-center">
                    <FaPhone className="text-purple-500 mr-4" />
                    <p><strong>Mobile:</strong> {student?.countryCode} {student?.mobileNo}</p>
                </div>

                <div className="flex items-center">
                    <FaEnvelope className="text-red-500 mr-4" />
                    <p><strong>Email:</strong> {student?.emailId}</p>
                </div>

                <div className="flex items-center">
                    <FaUniversity className="text-indigo-500 mr-4" />
                    <p><strong>College:</strong> {student?.collegeName}</p>
                </div>

                <div className="flex items-center">
                    <FaBook className="text-yellow-500 mr-4" />
                    <p><strong>College Roll No:</strong> {student?.collageRollNo}</p>
            </div>
            
            <div className="flex items-center">
                <FaCalendarAlt className="text-yellow-500 mr-4" />
                <p><strong>Semester:</strong> {student?.semester}</p>
            </div>

            <div className="flex items-center">
                <FaGraduationCap className="text-yellow-500 mr-4" />
                <p><strong>Batch:</strong> {student?.batchYear} - {student.passoutYear }</p>
            </div>



                <div className="flex items-center">
                    <FaBirthdayCake className="text-pink-500 mr-4" />
                    <p><strong>DOB:</strong> {new Date(student?.dateOfBirth).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center">
                    <p><strong>Gender:</strong> {student?.Gender === "Male" ? "👨" : student?.Gender === "Female" ? "👩" : "⚧️"} {student?.Gender}</p>
                </div>

                <div className="flex items-center">
                    <FaCodeBranch className="text-orange-500 mr-4" />
                    <p><strong>Course:</strong> {student?.course}</p>
                </div>

                <div className="flex items-center">
                    <FaBook className="text-green-600 mr-4" />
                    <p><strong>Department:</strong> {student?.department}</p>
                </div>

                <div className="flex items-center col-span-2">
                    <FaMapMarkerAlt className="text-red-600 mr-4" />
                    <p><strong>Address:</strong> {student?.city}, {student?.state}, {student?.country}</p>
                </div>
            </div>

            {/* Edit Profile Button */}
            <div className="text-center mt-8">
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Edit Profile ✏️
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h3 className="text-2xl font-semibold mb-6 text-blue-600">Edit Profile</h3>

                        <div className="mb-6">
                            <label htmlFor="headline" className="block text-sm font-semibold mb-2">Headline</label>
                            {/* Headline Input */}
                            <input
                                type="text"
                                id="headline"
                                name="headline"
                                value={profileData.headline}
                                onChange={handleProfileChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-md shadow-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter headline"
                            />

                            {profileData.headline && !isCustomHeadline && filteredHeadlines.length > 0 && (
                                <div className="absolute bg-white w-max mt-2 border-2 border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto z-10">
                                    {filteredHeadlines.map((option, index) => (
                                        <div
                                            key={index}
                                            className="p-3 cursor-pointer hover:bg-gray-200"
                                            onClick={() => {
                                                setProfileData({ ...profileData, headline: option });
                                                setIsCustomHeadline(true); 
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="mb-6 relative">
                            <label htmlFor="skills" className="block text-sm font-semibold mb-2">Skills</label>
                            <input
                                type="text"
                                id="skills"
                                value={skillInput}
                                onChange={handleSkillInputChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-md shadow-md focus:outline-none focus:border-blue-500"
                                placeholder="Type your skills"
                                disabled={Array.isArray(profileData?.skills) && profileData.skills.length >= 5}
                            />


                            {Array.isArray(suggestedSkills) && suggestedSkills.length > 0 && (
                                <div className="absolute bg-white w-full mt-2 border-2 border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto z-10">
                                    {suggestedSkills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="p-3 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSkillSelect(skill)}
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {profileData?.skills?.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {profileData.skills.map((skill, index) => (
                                        <div key={index} className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center">
                                            {skill}
                                            <button
                                                className="ml-2 text-sm font-bold text-white hover:text-red-500"
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No skills added yet.</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="workExperience" className="block text-sm font-semibold mb-2">Work Experience</label>
                            <textarea
                                id="workExperience"
                                name="workExperience"
                                value={profileData.workExperience}
                                onChange={handleProfileChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-md shadow-md focus:outline-none focus:border-blue-500"
                                placeholder="Describe your work experience"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="currentCompany" className="block text-sm font-semibold mb-2">Current Company</label>
                            <input
                                type="text"
                                id="currentCompany"
                                name="currentCompany"
                                value={profileData.currentCompany}
                                onChange={handleProfileChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-md shadow-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter current company name"
                            />
                        </div>

                        <div className="flex justify-end space-x-6">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SProfile;
