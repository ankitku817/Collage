import React, { useState, useEffect } from "react";
import axios from "axios";

function Applied_students() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 5;

    useEffect(() => {
        const fetchCompanies = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: No token found");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get("http://localhost:5000/api/employee/allcompanies", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const merged = [
                    ...response.data.active.map((c) => ({ ...c, status: "active" })),
                    ...response.data.outgoing.map((c) => ({ ...c, status: "outgoing" })),
                ];

                setCompanies(merged);
                setFilteredCompanies(merged);
            } catch (err) {
                setError("Failed to fetch companies. Please check your authentication.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        let updated = [...companies];

        if (filterStatus !== "all") {
            updated = updated.filter((c) => c.status === filterStatus);
        }

        if (searchQuery) {
            updated = updated.filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredCompanies(updated);
        setCurrentPage(1); // reset to page 1 when filter/search changes
    }, [searchQuery, filterStatus, companies]);

    const handleView = (company) => setSelectedCompany(company);
    const handleClose = () => setSelectedCompany(null);

    const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
    const currentData = filteredCompanies.slice(
        (currentPage - 1) * companiesPerPage,
        currentPage * companiesPerPage
    );

    if (loading) return <p className="text-center">Loading companies... 🕒</p>;
    if (error) return <p className="text-red-600 text-center">{error} ❌</p>;

    return (
        <div className="p-4 md:p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
                List of Companies Where Students Applied
            </h1>

            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by company name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/3"
                />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/4"
                >
                    <option value="all">All Companies</option>
                    <option value="active">Active Companies</option>
                    <option value="outgoing">Outgoing Companies</option>
                </select>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                    📋 Company List
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200 text-sm sm:text-base">
                            <tr>
                                <th className="border p-3">S.No.</th>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Industry</th>
                                <th className="border p-3">Contact</th>
                                <th className="border p-3">Arrival</th>
                                <th className="border p-3">Departure</th>
                                <th className="border p-3">Image</th>
                                <th className="border p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((company, index) => (
                                <tr key={company._id} className="text-sm sm:text-base">
                                    <td className="border p-2">{(currentPage - 1) * companiesPerPage + index + 1}</td>
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
                                                className="w-24 h-14 object-cover mx-auto"
                                            />
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleView(company)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === idx + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Applied_students;
