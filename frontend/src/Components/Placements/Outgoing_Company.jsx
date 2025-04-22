import React, { useState, useEffect } from "react";
import axios from "axios";
function Outgoing_Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/employee/companies/outgoing", {
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

  const handleView = (company) => {
    setSelectedCompany(company);
  };

  const handleClose = () => {
    setSelectedCompany(null);
  };

  if (loading) return <p className="text-center">Loading companies... 🕒</p>;
  if (error) return <p className="text-red-600 text-center">{error} ❌</p>;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
        🏢 Outgoing Companies
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
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleView(company)}
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
    </div>
  );
}
export default Outgoing_Company;
