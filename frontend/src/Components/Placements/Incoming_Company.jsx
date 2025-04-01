import React, { useState, useEffect } from "react";
import axios from "axios";

function Incoming_Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    contact: "",
    arrivalDate: "",
    departureDate: "",
  });

  // Fetch Companies with Authorization Token
  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/employee/companies", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in request
          },
        });
        setCompanies(response.data);
      } catch (error) {
        setError("Failed to fetch companies. Please check your authentication.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  // Add New Company with Authorization Token
  const addCompany = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/employee/companies", newCompany, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies([...companies, response.data]);
      setNewCompany({ name: "", industry: "", contact: "", arrivalDate: "", departureDate: "" });
    } catch (error) {
      setError("Failed to add company.");
    }
  };

  // Delete Company with Authorization Token
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

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">🏢 Incoming & Outgoing Companies</h1>

      {/* Add New Company Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">➕ Add New Company</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Company Name" className="p-2 border rounded" value={newCompany.name} onChange={handleInputChange} />
          <input type="text" name="industry" placeholder="Industry" className="p-2 border rounded" value={newCompany.industry} onChange={handleInputChange} />
          <input type="text" name="contact" placeholder="Contact" className="p-2 border rounded" value={newCompany.contact} onChange={handleInputChange} />
          <input type="date" name="arrivalDate" className="p-2 border rounded" value={newCompany.arrivalDate} onChange={handleInputChange} />
          <input type="date" name="departureDate" className="p-2 border rounded" value={newCompany.departureDate} onChange={handleInputChange} />
        </div>
        <button className="bg-blue-500 text-white p-2 rounded mt-4" onClick={addCompany}>Add Company</button>
      </div>

      {/* Companies List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">📋 Company List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">🏢 Name</th>
              <th className="border p-2">🏭 Industry</th>
              <th className="border p-2">📞 Contact</th>
              <th className="border p-2">📅 Arrival Date</th>
              <th className="border p-2">🚪 Departure Date</th>
              <th className="border p-2">🛠 Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id} className="text-center">
                <td className="border p-2">{company.name}</td>
                <td className="border p-2">{company.industry}</td>
                <td className="border p-2">{company.contact}</td>
                <td className="border p-2">{company.arrivalDate}</td>
                <td className="border p-2">{company.departureDate}</td>
                <td className="border p-2">
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteCompany(company._id)}>❌ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Incoming_Company;
