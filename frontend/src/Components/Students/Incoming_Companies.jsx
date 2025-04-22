import React, { useState, useEffect } from "react";
import axios from "axios";
function Incoming_Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [appliedCompanies, setAppliedCompanies] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    universityRollNo: "",
    collegeRollNo: "",
    gender: "",
    dob: "",
    address: "",
    branch: "",
    passingYear: "",
    tenthScore: "",
    twelfthScore: "",
    graduationScore: "",
    pgScore: "",
    about: "",
  });
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
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/student/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Failed to fetch companies. Please check your authentication.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRoundsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedRounds = [...prev.rounds];
      updatedRounds[name] = value;
      return { ...prev, rounds: updatedRounds };
    });
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };
  const handleView = (company) => {
    setSelectedCompany(company);
  };
  const handleClose = () => {
    setSelectedCompany(null);
  };
  const handleApply = (company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };
  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setFormData((prev) => ({
      ...prev,
      course: selectedCourse,
      branch: "", 
    }));
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please login first.");
      return;
    }
    try {
      const checkResponse = await axios.get(
        "http://localhost:5000/api/student/check-application",
        {
          params: {
            companyId: selectedCompany._id,
            collegeRollNo: formData.collegeRollNo,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (checkResponse.data.alreadyApplied) {
        alert("⚠️ You have already applied for this company.");
        return;
      }
    } catch (checkErr) {
      console.error("Error checking application status:", checkErr);
      alert("Error verifying your application status. Please try again.");
      return;
    }
    const eligibility = selectedCompany.eligibilityCriteria;

    const isTenthValid =
      parseFloat(formData.tenthScore) >= parseFloat(eligibility.percentage);
    const isTwelfthValid =
      parseFloat(formData.twelfthScore) >= parseFloat(eligibility.percentage);
    const isGraduationValid =
      parseFloat(formData.graduationScore) >= parseFloat(eligibility.percentage);

    const isPercentageValid = isTenthValid && isTwelfthValid && isGraduationValid;

    const isBranchValid =
      eligibility.branch.trim().toLowerCase() ===
      formData.branch.trim().toLowerCase();

    const isPassingYearValid =
      parseInt(formData.passingYear) === parseInt(eligibility.passOutYear);

    if (!isBranchValid || !isPassingYearValid || !isPercentageValid) {
      let errorMsg = "You are not eligible to apply due to the following reasons:\n";
      if (!isBranchValid)
        errorMsg += "- Your branch does not match the required branch.\n";
      if (!isPassingYearValid)
        errorMsg += "- Your passing year does not match the required year.\n";
      if (!isTenthValid)
        errorMsg += `- Your 10th score (${formData.tenthScore}%) is below ${eligibility.percentage}%.\n`;
      if (!isTwelfthValid)
        errorMsg += `- Your 12th score (${formData.twelfthScore}%) is below ${eligibility.percentage}%.\n`;
      if (!isGraduationValid)
        errorMsg += `- Your graduation score (${formData.graduationScore}%) is below ${eligibility.percentage}%.\n`;
      alert(errorMsg);
      return;
    }
    const data = new FormData();
    data.append("companyId", selectedCompany._id);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("resume", resumeFile);
    data.append("universityRollNo", formData.universityRollNo);
    data.append("collegeRollNo", formData.collegeRollNo);
    data.append("dob", formData.dob);
    data.append("branch", formData.branch);
    data.append("passingYear", formData.passingYear);
    data.append("tenthScore", formData.tenthScore);
    data.append("twelfthScore", formData.twelfthScore);
    data.append("graduationScore", formData.graduationScore);
    data.append("pgScore", formData.pgScore);
    data.append("about", formData.about);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/student/apply",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Application submitted!");
      setAppliedCompanies((prev) => new Set(prev).add(selectedCompany._id));
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("❌ Failed to apply");
    }
  };

  if (loading) return <p className="text-center">Loading companies... 🕒</p>;
  if (error) return <p className="text-red-600 text-center">{error} ❌</p>;
  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
        🏢 Incoming & Outgoing Companies
      </h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          📋 Company List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-sm sm:text-base">
              <tr>
                <th className="border p-10">Name</th>
                <th className="border p-10">Industry</th>
                <th className="border p-8">Contact</th>
                <th className="border p-8">Arrival</th>
                <th className="border p-8">Departure</th>
                <th className="border p-16">Image</th>
                <th className="border p-0">Job Description</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id} className="text-sm sm:text-base">
                  <td className="border p-2">{company.name}</td>
                  <td className="border p-2">{company.industry}</td>
                  <td className="border p-2">{company.contact}</td>
                  <td className="border p-2">{company.arrivalDate?.slice(0, 10)}</td>
                  <td className="border p-2">{company.departureDate?.slice(0, 10)}</td>
                  <td className="border p-0">
                    {company.companyImage && (
                      <img
                        src={`http://localhost:5000/uploads/${company.companyImage}`}
                        alt="Company"
                        className="w-44 h-16 object-cover mx-auto"
                      />
                    )}
                  </td>
                  <td className="border p-2">{company.jobDescription}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleView(company)}>
                      View
                    </button>
                    {appliedCompanies.has(company._id) ? (
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded cursor-not-allowed"
                        disabled>
                        Applied
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => handleApply(company)}>
                        Apply
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖</button>
              <h3 className="text-xl font-bold mb-4">{selectedCompany.name}</h3>
              <p><strong>Industry:</strong> {selectedCompany.industry}</p>
              <p><strong>Contact:</strong> {selectedCompany.contact}</p>
              <p><strong>Location:</strong> {selectedCompany.location}</p>
              <p><strong>Arrival:</strong> {selectedCompany.arrivalDate?.slice(0, 10)}</p>
              <p><strong>Departure:</strong> {selectedCompany.departureDate?.slice(0, 10)}</p>
              <div className="mt-4">
                <strong>Eligibility:</strong>
                <ul className="list-disc list-inside">
                  <li><strong>Passout Year:</strong> {selectedCompany.eligibilityCriteria?.passOutYear}</li>
                  <li><strong>Percentage:</strong> {selectedCompany.eligibilityCriteria?.percentage}%</li>
                  <li><strong>Branch:</strong> {selectedCompany.eligibilityCriteria?.branch}</li>
                </ul>
              </div>
              <p className="mt-2"><strong>Job Description:</strong> {selectedCompany.jobDescription}</p>
              <div className="mt-4">
                <strong>Rounds:</strong>
                <ul className="list-disc list-inside">
                  {selectedCompany.rounds?.map((round, idx) => (
                    <li key={idx}>
                      <strong>{round.roundName}:</strong> {round.description}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedCompany.companyImage && (
                <img
                  src={`http://localhost:5000/uploads/${selectedCompany.companyImage}`}
                  alt="Company"
                  className="w-full h-40 object-contain mt-4"
                />
              )}
              {selectedCompany.companyPdf && (
                <button
                  className="w-full h-40 object-contain mt-4"
                  onClick={() => window.open(`http://localhost:5000/uploads/${selectedCompany.companyPdf}`)}
                >
                  View attachment
                </button>
              )}
            </div>
          </div>
        )}
        {showForm && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖</button>
              <h2 className="text-xl font-semibold mb-4 text-center">Apply to {selectedCompany.name}</h2>
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name*</label>
                  <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email*</label>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">University Roll No*</label>
                  <input type="text" name="universityRollNo" value={formData.universityRollNo} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">College Roll No*</label>
                  <input type="text" name="collegeRollNo" value={formData.collegeRollNo} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone Number*</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Gender*</label>
                  <select name="gender" value={formData.gender} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">Select an option</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Date of Birth*</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Permanent Address*</label>
                  <textarea name="address" value={formData.address} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                  <label className="block">
                    <span className="text-gray-700">Course</span>
                    <select
                      name="course"
                      className="p-2 mt-1 border rounded w-full"
                      value={formData.course}
                      onChange={handleCourseChange}>
                      <option value="">Select Course</option>
                      {Object.keys(courseDepartments).map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Branch/Department</span>
                    <select
                      name="branch"
                      className="p-2 mt-1 border rounded w-full"
                      value={formData.branch}
                      onChange={handleInputChange}
                      disabled={!formData.course}>
                      <option value="">Select Branch</option>
                      {formData.course &&
                        courseDepartments[formData.course].map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                    </select>
                  </label>
                <div>
                  <label className="block text-sm font-medium">Passing Out Year*</label>
                  <input type="number" name="passingYear" value={formData.passingYear} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">10th CGPA / Percentage*</label>
                  <input type="text" name="tenthScore" value={formData.tenthScore} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">12th / Diploma CGPA / Percentage*</label>
                  <input type="text" name="twelfthScore" value={formData.twelfthScore} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Graduation CGPA / Percentage*</label>
                  <input type="text" name="graduationScore" value={formData.graduationScore} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">PG CGPA / Percentage</label>
                  <input type="text" name="pgScore" value={formData.pgScore} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Resume (PDF)*</label>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} required className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium">About Me*</label>
                  <textarea name="about" value={formData.about} onChange={handleFormChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Incoming_Companies;
