import React, { useState, useEffect } from "react";
import axios from "axios";
function Incoming_Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
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
  const initialCompanyState = {
    name: "",
    industry: "",
    contact: "",
    location: "",
    arrivalDate: "",
    departureDate: "",
    jobDescription: "",
    course: "",
    branch: "",
    passOutYear: "",
    percentage: "",
    rounds: [],
    companyImage: null,
    companyPdf: null,
  };

  const [newCompanys, setNewCompanys] = useState(initialCompanyState);

  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    contact: "",
    location: "",
    arrivalDate: "",
    departureDate: "",
    eligibility: "",
    passoutYear: "",
    course: "",
    branch: "",
    jobDescription: "",
    rounds: [],
    companyImage: null,
    companyPdf: null,
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/employee/companies", {
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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  const handleInputChange = (e) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  // const handleRoundsChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewCompany((prev) => {
  //     const updatedRounds = [...prev.rounds];
  //     updatedRounds[name] = value;
  //     return { ...prev, rounds: updatedRounds };
  //   });
  // };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: files[0] }));
  };
  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setNewCompany((prev) => ({
      ...prev,
      course: selectedCourse,
      branch: "",
    }));
  };


  const addCompany = async () => {
    const token = localStorage.getItem("token"); 

    if (!token) {
      console.error("❌ No token found. Please log in.");
      return; 
    }
    const formData = new FormData();
    formData.append("name", newCompany.name);
    formData.append("industry", newCompany.industry);
    formData.append("contact", newCompany.contact);
    formData.append("location", newCompany.location);
    formData.append("arrivalDate", newCompany.arrivalDate);
    formData.append("departureDate", newCompany.departureDate);
    formData.append("jobDescription", newCompany.jobDescription);
    if (newCompany.companyPdf instanceof File) {
      formData.append("companyPdf", newCompany.companyPdf);
    }
    formData.append("eligibilityCriteria", JSON.stringify({
      percentage: newCompany.percentage || 60,
      passOutYear: newCompany.passOutYear || 2025,
      branch: newCompany.branch || "B.Tech CSE"
    }));
    formData.append("rounds", JSON.stringify(newCompany.rounds));

    if (newCompany.companyImage instanceof File) {
      formData.append("companyImage", newCompany.companyImage);
    } else {
      console.error("❌ Invalid file selected:", newCompany.companyImage);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/employee/companies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Company added successfully", response.data);
      setSuccessMessage("✅ Company added successfully!");
      setNewCompany(initialCompanyState);
    } catch (error) {
      console.error("❌ Failed to add company", error.response?.data || error.message);
      setSuccessMessage("❌ Failed to add company. Please try again.");

    }
  };

  const handleView = (company) => {
    setSelectedCompany(company);
  };

  const handleClose = () => {
    setSelectedCompany(null);
  };


  const deleteCompany = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/employee/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(companies.filter((company) => company._id !== id));
    } catch (error) {
      setError("Failed to delete company.");
    }
  };
  

  if (loading) return <p className="text-center">Loading companies... 🕒</p>;
  if (error) return <p className="text-red-600 text-center">{error} ❌</p>;
  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
        🏢 Incoming & Outgoing Companies
      </h1>

      {/* Form Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          ➕ Add New Company
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Repeatable Input Fields */}
          {[
            { label: "Company Name", name: "name", placeholder: "Enter company name" },
            { label: "Industry", name: "industry", placeholder: "Enter industry" },
            { label: "Contact", name: "contact", placeholder: "Enter contact info" },
            { label: "Location", name: "location", placeholder: "Enter Placement Drive Location" },
            { label: "Arrival Date", name: "arrivalDate", type: "date" },
            { label: "Departure Date", name: "departureDate", type: "date" },
            { label: "Eligibility", name: "eligibility", placeholder: "Eligibility criteria" },
            { label: "Passout Year", name: "passoutYear", placeholder: "Passout year" },
          ].map(({ label, name, type = "text", placeholder }) => (
            <label key={name} className="block">
              <span className="text-gray-700">{label}</span>
              <input
                type={type}
                name={name}
                className="p-2 mt-1 border rounded w-full"
                placeholder={placeholder}
                value={newCompany[name]}
                onChange={handleInputChange}
              />
            </label>
          ))}

          {/* Course Selection */}
          <label className="block">
            <span className="text-gray-700">Course</span>
            <select
              name="course"
              className="p-2 mt-1 border rounded w-full"
              value={newCompany.course}
              onChange={handleCourseChange}
            >
              <option value="">Select Course</option>
              {Object.keys(courseDepartments).map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>

          {/* Branch Selection */}
          <label className="block">
            <span className="text-gray-700">Branch/Department</span>
            <select
              name="branch"
              className="p-2 mt-1 border rounded w-full"
              value={newCompany.branch}
              onChange={handleInputChange}
              disabled={!newCompany.course}
            >
              <option value="">Select Branch</option>
              {newCompany.course &&
                courseDepartments[newCompany.course].map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
            </select>
          </label>


          {/* Job Description */}
          <label className="block">
            <span className="text-gray-700">Job Description</span>
            <textarea
              name="jobDescription"
              className="p-2 mt-1 border rounded w-full"
              placeholder="Enter job description"
              value={newCompany.jobDescription}
              onChange={handleInputChange}
            />
          </label>

          {/* File Inputs */}
          <label className="block">
            <span className="text-gray-700">Company Image</span>
            <input
              type="file"
              name="companyImage"
              className="p-2 mt-1 border rounded w-full"
              onChange={handleFileChange}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Company PDF</span>
            <input
              type="file"
              name="companyPdf"
              accept="application/pdf"
              className="p-2 mt-1 border rounded w-full"
              onChange={handleFileChange}
            />
          </label>

          {/* Rounds Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-2">Rounds:</h3>
            <select
              className="p-2 border rounded w-full mb-4"
              value={newCompany.rounds.length}
              onChange={(e) => {
                const roundCount = parseInt(e.target.value, 10);
                setNewCompany((prev) => ({
                  ...prev,
                  rounds: Array.from({ length: roundCount }, () => ({
                    roundName: "",
                    description: "",
                  })),
                }));
              }}
            >
              <option value="0">Select number of rounds</option>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} Round{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            {newCompany.rounds.map((round, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder={`Round ${index + 1} Name`}
                  className="p-2 border rounded w-full mb-2"
                  value={round.roundName}
                  onChange={(e) => {
                    const updatedRounds = [...newCompany.rounds];
                    updatedRounds[index].roundName = e.target.value;
                    setNewCompany((prev) => ({ ...prev, rounds: updatedRounds }));
                  }}
                />
                <textarea
                  placeholder={`Round ${index + 1} Description`}
                  className="p-2 border rounded w-full"
                  value={round.description}
                  onChange={(e) => {
                    const updatedRounds = [...newCompany.rounds];
                    updatedRounds[index].description = e.target.value;
                    setNewCompany((prev) => ({ ...prev, rounds: updatedRounds }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded mt-6 w-full transition"
          onClick={addCompany}
        >
          Add Company
        </button>
        {successMessage && (
          <div className={`p-3 rounded mb-4 text-white ${successMessage.startsWith("✅") ? "bg-green-600" : "bg-red-600"}`}>
            {successMessage}
          </div>
        )}

      </div>

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
                <th className="border p-2">Contact</th>
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
                  <td className="border p-2">
                    {company.companyImage && (
                      <img
                        src={`http://localhost:5000/uploads/${company.companyImage}`}
                        alt="Company"
                        className="w-32 h-16 object-cover mx-auto"
                      />
                    )}
                  </td>
                  <td className="border p-0">{company.jobDescription}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleView(company)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => deleteCompany(company._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
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
      </div>
    </div>
  );
}

export default Incoming_Company;
