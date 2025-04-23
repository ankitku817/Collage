import React, { useState, useEffect } from "react";
import axios from "axios";

function Applied_companies() {
    const [appliedCompanies, setAppliedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const fetchAppliedCompanies = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: No token found");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get("http://localhost:5000/api/student/applied-comapnies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAppliedCompanies(response.data);
            } catch (error) {
                setError("Failed to fetch applied companies. Please check your authentication.");
            } finally {
                setLoading(false);
            }
        };
        fetchAppliedCompanies();
    }, []);

    const handleView = (company) => {
        setSelectedCompany(company);
    };

    const handleClose = () => {
        setSelectedCompany(null);
    };

    if (loading) return <p className="text-center">Loading applied companies... 🕒</p>;
    if (error) return <p className="text-red-600 text-center">{error} ❌</p>;

    return (
        <div className="p-4 md:p-6 bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-purple-800 mb-6">
                ✅ Applied Companies
            </h1>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                    📋 Applied Company List
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200 text-sm sm:text-base">
                            <tr>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Industry</th>
                                <th className="border p-2">Contact</th>
                                <th className="border p-2">Arrival</th>
                                <th className="border p-2">Departure</th>
                                <th className="border p-2">Image</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appliedCompanies.map((company) => (
                                company && (
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
                                        <td className="border p-2">
                                            <button
                                                className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
                                                onClick={() => handleView(company)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedCompany && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-xl relative overflow-y-auto max-h-[90vh]">
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
                                    className="w-full bg-purple-500 text-white py-2 mt-4 rounded hover:bg-purple-600"
                                    onClick={() => window.open(`http://localhost:5000/uploads/${selectedCompany.companyPdf}`)}
                                >
                                    View Attachment
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Applied_companies;
