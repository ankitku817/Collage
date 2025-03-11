import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/admin/employees", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            } catch (err) {
                setError("Failed to fetch employees.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        let filtered = employees;

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(
                (employee) =>
                    employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by department
        if (departmentFilter) {
            filtered = filtered.filter(
                (employee) => employee.department === departmentFilter
            );
        }

        setFilteredEmployees(filtered);
    }, [searchQuery, departmentFilter, employees]);

    if (loading) return <p>Loading employees...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Employee List</h2>

            {/* 🔍 Search and Filter */}
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by Code or Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                />

                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="border p-2 rounded-lg"
                >
                    <option value="">All Departments</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>
            <ul className="space-y-4">
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                        <li key={employee._id} className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-xl font-semibold">
                                Employee Code: {employee.epmId}
                            </h3>
                            <p>Name: {employee.name}</p>
                            <p>Department: {employee.department}</p>
                            <p>Joining Date: {new Date(employee.joiningDate).toLocaleDateString()}</p>
                        </li>
                    ))
                ) : (
                    <p>No employees found.</p>
                )}
            </ul>
        </div>
    );
};

export default EmployeeList;
