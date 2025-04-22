import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OngoingRecruitments = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCriteria, setFilterCriteria] = useState("companyName");
    const [sortCriteria, setSortCriteria] = useState("deadline"); 

    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/employee/recruitments", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecruitments(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch recruitment data.");
                setLoading(false);
            }
        };

        fetchRecruitments();
    }, []);

    // Filter recruitments based on search query
    const filteredRecruitments = recruitments.filter((item) =>
        item[filterCriteria]?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the filtered recruitments based on selected criteria
    const sortedRecruitments = [...filteredRecruitments].sort((a, b) => {
        if (sortCriteria === "deadline") {
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortCriteria === "ctc") {
            return a.ctc - b.ctc;
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Ongoing Recruitments</h1>

            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="flex justify-between mb-6">
                {/* Search Filter */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by company name, position, or location"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                    <select
                        value={filterCriteria}
                        onChange={(e) => setFilterCriteria(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    >
                        <option value="companyName">Company Name</option>
                        <option value="role">Position</option>
                        <option value="location">Location</option>
                    </select>
                </div>

                {/* Sorting Options */}
                <div className="flex gap-4">
                    <select
                        value={sortCriteria}
                        onChange={(e) => setSortCriteria(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    >
                        <option value="deadline">Sort by Deadline</option>
                        <option value="ctc">Sort by CTC</option>
                    </select>
                </div>
            </div>

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedRecruitments.length > 0 ? (
                        sortedRecruitments.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                <h2 className="text-xl font-semibold text-blue-600">{item.companyName}</h2>
                                <p className="text-gray-700 mt-2">Position: {item.role}</p>
                                <p className="text-gray-700">CTC: {item.ctc} LPA</p>
                                <p className="text-gray-700">Location: {item.location}</p>
                                <p className="text-gray-700">Deadline: {new Date(item.deadline).toLocaleDateString()}</p>
                                <Link
                                    to={`/placement-homepages/recruitments/${item._id}`}
                                    className="block mt-4 text-blue-500 hover:underline"
                                >
                                    View More
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600">No ongoing recruitments at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default OngoingRecruitments;
