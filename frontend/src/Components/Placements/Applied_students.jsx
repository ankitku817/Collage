import React, { useState, useEffect } from "react";
import axios from "axios";

function Applied_students() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [applications, setApplications] = useState([]);
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
        setCurrentPage(1);
    }, [searchQuery, filterStatus, companies]);

    const handleView = async (company) => {
        setSelectedCompany(company);
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Unauthorized: No token found");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:5000/api/employee/applications/${company._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setApplications(response.data);
            console.log(response.data);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        }
    };

    const handleClose = () => {
        setSelectedCompany(null);
        setApplications([]);
    };

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
                                    <td className="border p-2">
                                        {new Date(company.arrivalDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border p-2">
                                        {new Date(company.departureDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleView(company)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            View Students
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-2">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`px-3 py-1 rounded ${currentPage === idx + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl shadow-lg overflow-y-auto max-h-[80vh]">
                        <h2 className="text-xl font-semibold mb-4">
                            Students Applied to {selectedCompany.name}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-3 py-2 text-left">S.No.</th>
                                        <th className="border px-3 py-2 text-left">Name</th>
                                        <th className="border px-3 py-2 text-left">Email</th>
                                        <th className="border px-3 py-2 text-left">Phone</th>
                                        <th className="border px-3 py-2 text-left">College Roll No</th>
                                        <th className="border px-3 py-2 text-left">University Roll No</th>
                                        <th className="border px-3 py-2 text-left">DOB</th>
                                        <th className="border px-3 py-2 text-left">Passing Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length > 0 ? (
                                        applications.map((app, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border px-3 py-2">{idx + 1}</td>
                                                <td className="border px-3 py-2">{app.name}</td>
                                                <td className="border px-3 py-2">{app.email}</td>
                                                <td className="border px-3 py-2">{app.phone}</td>
                                                <td className="border px-3 py-2">{app.collegeRollNo}</td>
                                                <td className="border px-3 py-2">{app.universityRollNo || 'N/A'}</td>
                                                <td className="border px-3 py-2">{new Date(app.dob).toLocaleDateString()}</td>
                                                <td className="border px-3 py-2">{app.passingYear}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="border px-3 py-2 text-center">
                                                No students applied yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button
                            onClick={handleClose}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Applied_students;
