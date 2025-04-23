import React, { useState, useEffect } from "react";
import axios from "axios";

function Outgoing_Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState({
    rounds: {},
    finalSelected: [],
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
        const response = await axios.get(
          "http://localhost:5000/api/student/companies/outgoing",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompanies(response.data);
      } catch (err) {
        setError("Failed to fetch companies. Please check your authentication.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleView = async (company) => {
    setSelectedCompany(company);
    try {
      const response = await fetch(
        `http://localhost:5000/api/student/getSelectedStudents/${company._id}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const formattedRounds = {};

        Object.keys(result.data).forEach((key) => {
          if (key.startsWith("round")) {
            formattedRounds[key] = result.data[key].selectedStudents || [];
          }
        });

        setSelectedStudents({
          rounds: formattedRounds,
          finalSelected: result.data.finalSelectedStudents || [],
        });
      }
    } catch (error) {
      console.error("Error fetching selected students:", error);
    }
  };

  const handleClose = () => setSelectedCompany(null);

  if (loading) return <p className="text-center text-xl">Loading companies... 🕒</p>;
  if (error) return <p className="text-red-600 text-center text-xl">{error} ❌</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">🏢 Outgoing Companies</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 Company List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-sm sm:text-base">
              <tr>
                <th className="border p-4">Name</th>
                <th className="border p-4">Industry</th>
                <th className="border p-4">Contact</th>
                <th className="border p-4">Arrival</th>
                <th className="border p-4">Departure</th>
                <th className="border p-4">Image</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id} className="text-sm sm:text-base">
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.industry}</td>
                  <td className="border p-2">{c.contact}</td>
                  <td className="border p-2">{c.arrivalDate?.slice(0, 10)}</td>
                  <td className="border p-2">{c.departureDate?.slice(0, 10)}</td>
                  <td className="border p-2">
                    {c.companyImage && (
                      <img
                        src={`http://localhost:5000/uploads/${c.companyImage}`}
                        alt={c.name}
                        className="w-32 h-12 object-cover mx-auto"
                      />
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleView(c)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                    >
                      See Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompany && (
        <div className="overflow-x-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Selected Students for {selectedCompany.name}
          </h2>

          {/* Table for displaying rounds and selected students */}
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">S.No.</th>
                {Object.keys(selectedStudents.rounds).map((roundName, index) => (
                  <th key={roundName} className="border px-4 py-2">
                    {roundName.replace("round", "Round ")} {/* Format the round name */}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(selectedStudents.rounds).map((students, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  {Object.keys(selectedStudents.rounds).map((roundName) => {
                    const roundStudents = selectedStudents.rounds[roundName];
                    return (
                      <td key={roundName} className="border px-4 py-2 text-center">
                        {roundStudents.length > 0
                          ? roundStudents[index] || "No student selected"
                          : "No students selected"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Display Final Selection */}
          <h3 className="text-lg font-semibold text-blue-700 mt-4">Final Selection</h3>
          <div className="border border-gray-300 p-4 mt-2">
            {selectedStudents.finalSelected.length > 0
              ? selectedStudents.finalSelected.join(", ")
              : "No final selections yet"}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Close View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Outgoing_Companies;
