import React, { useState, useEffect } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OngoingRecruitment() {
    const [todayCompanies, setTodayCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [applications, setApplications] = useState([]);
    const [showRoundsCompanyId, setShowRoundsCompanyId] = useState(null);
    const [showStudents, setShowStudents] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState({});

    useEffect(() => {
        async function fetchToday() {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    'http://localhost:5000/api/student/todaycompanies',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log("Today companies:", res.data); 
                setTodayCompanies(res.data);
            } catch (err) {
                console.error(err);
                setError("Could not load today’s recruitments.");
            } finally {
                setLoading(false);
            }
        }

        fetchToday();
    }, []);


    useEffect(() => {
        const fetchSelectedStudents = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/student/getSelectedStudents/${selectedCompany._id}`);
                const result = await response.json();

                if (result.success && result.data) {
                    const formatted = {};
                    selectedCompany.rounds.forEach((_, index) => {
                        formatted[index] = result.data[`round${index + 1}`]?.selectedStudents || [];
                    });
                    setSelectedStudents(formatted);
                }
            } catch (error) {
                console.error("Error fetching selected students:", error);
            }
        };

        if (selectedCompany?._id) {
            fetchSelectedStudents();
        }
    }, [selectedCompany]);

    const handleViewStudents = async (company) => {
        setSelectedCompany(company);
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Unauthorized: No token found");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:5000/api/student/applications/${company._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setApplications(response.data);
            setShowStudents(true);
            setShowRoundsCompanyId(null);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        }
    };

    const handleShowRounds = async (company) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Unauthorized: No token found");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:5000/api/student/applications/${company._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSelectedCompany(company);
            setApplications(response.data);
            setShowRoundsCompanyId(prev => prev === company._id ? null : company._id);
            setShowStudents(false);
        } catch (err) {
            console.error("Failed to fetch applications for rounds:", err);
        }
    };

    const handleClose = () => {
        setSelectedCompany(null);
        setApplications([]);
        setShowStudents(false);
        setShowRoundsCompanyId(null);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBriefcase className="text-blue-600 text-3xl" />
                    Ongoing Recruitments Today
                </h2>
                <Link
                    to="/placement-homepages/recruitments"
                    className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition"
                >
                    View All
                </Link>
            </div>

            {loading ? (
                <p className="text-gray-600 text-lg">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-lg">{error}</p>
            ) : todayCompanies.length === 0 ? (
                <p className="text-gray-600 text-lg">No companies arriving today.</p>
            ) : (
                todayCompanies.map((company) => (
                    <div
                        key={company._id}
                        className="mb-6 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <h3 className="text-2xl font-semibold text-gray-900 mb-1">{company.name}</h3>
                        <p className="text-gray-500 mb-2 italic">{company.industry.trim()}</p>

                        <div className="text-gray-800 mb-2">
                            <strong>Job Description:</strong> {company.jobDescription}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <p><strong>Location:</strong> {company.location}</p>
                            <p><strong>Contact:</strong> {company.contact.trim()}</p>
                            <p>
                                <strong>Arrival:</strong> {new Date(company.arrivalDate).toLocaleDateString()} <br />
                                <strong>Departure:</strong> {new Date(company.departureDate).toLocaleDateString()}
                            </p>
                            <div>
                                <strong>Eligibility:</strong>
                                <ul className="list-disc list-inside ml-2 text-gray-700">
                                    <li><strong>Branch:</strong> {company.eligibilityCriteria.branch}</li>
                                    <li><strong>Passout Year:</strong> {company.eligibilityCriteria.passOutYear}</li>
                                    <li><strong>Min %:</strong> {company.eligibilityCriteria.percentage}%</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => handleViewStudents(company)}
                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                            >
                                View Applied Students
                            </button>
                            <button
                                onClick={() => handleShowRounds(company)}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ml-4"
                            >
                                {showRoundsCompanyId === company._id ? 'Hide Selection Rounds' : 'Show Selection Rounds'}
                            </button>
                        </div>

                        {showRoundsCompanyId === company._id && company.rounds.length > 0 && (
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-4 py-2">S.No.</th>
                                            <th className="border px-4 py-2">Applied Students</th>
                                            {company.rounds.map((round, i) => (
                                                <th key={i} className="border px-4 py-2">{`Round ${i + 1}: ${round.roundName}`}</th>
                                            ))}
                                            <th className="border px-4 py-2">Final Selected</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.length > 0 ? (
                                            applications.map((app, idx) => (
                                                <tr key={idx}>
                                                    <td className="border px-4 py-2">{idx + 1}</td>
                                                    <td className="border px-4 py-2">{app.universityRollNo || 'N/A'}</td>

                                                    {company.rounds.map((_, i) => (
                                                        <td key={i} className="border px-4 py-2 text-center">
                                                            {selectedStudents[i]?.includes(app.universityRollNo) ? (
                                                                <>
                                                                    {app.universityRollNo}
                                                                </>
                                                            ) : (
                                                                <span>Not Selected</span>
                                                            )}
                                                        </td>
                                                    ))}

                                                    <td className="border px-4 py-2 text-center">
                                                        {selectedStudents[company.rounds.length - 1]?.includes(app.universityRollNo)
                                                            ? app.universityRollNo
                                                            : ''}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={company.rounds.length + 3} className="border px-4 py-2 text-center">
                                                    No students applied yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))
            )}

            {showStudents && selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl shadow-lg overflow-y-auto max-h-[80vh]">
                        <h2 className="text-xl font-semibold mb-4">
                            Students Applied to {selectedCompany.name}
                        </h2>
                        <button onClick={handleClose} className="absolute top-4 right-6 text-gray-600 hover:text-black text-xl">CLOSE</button>
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">S.No.</th>
                                    <th className="py-2 px-4 border">Student Name</th>
                                    <th className="py-2 px-4 border">University Roll No.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length > 0 ? (
                                    applications.map((app, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-4 py-2">{idx + 1}</td>
                                            <td className="border px-4 py-2">{app.name}</td>
                                            <td className="border px-4 py-2">{app.universityRollNo}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="border text-center py-2">No students have applied yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OngoingRecruitment;
