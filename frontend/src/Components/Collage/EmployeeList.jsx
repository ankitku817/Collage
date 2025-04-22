import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        fatherName: "",
        course: "",
        experience: "",
        dob: "",
        mobile: "",
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/admin/employees", {
                    headers: { Authorization: `Bearer ${token}` },
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

        if (searchQuery) {
            filtered = filtered.filter(
                (employee) =>
                    employee.epmId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (departmentFilter) {
            filtered = filtered.filter((employee) => employee.department === departmentFilter);
        }

        setFilteredEmployees(filtered);
    }, [searchQuery, departmentFilter, employees]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this employee?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/admin/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        } catch {
            alert("Failed to delete employee.");
        }
    };

    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setEditForm({
            name: employee.name || "",
            fatherName: employee.fatherName || "",
            course: employee.course || "",
            experience: employee.experience || "",
            dob: employee.dob?.split("T")[0] || "",
            mobile: employee.mobileNo || "",
        });
        setEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // const handleEditSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const token = localStorage.getItem("token");
    //         await axios.put(
    //             `http://localhost:5000/api/admin/employees/${selectedEmployee._id}`,
    //             editForm,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         setEmployees((prev) =>
    //             prev.map((emp) => (emp._id === selectedEmployee._id ? { ...emp, ...editForm } : emp))
    //         );
    //         setEditModalOpen(false);
    //     } catch {
    //         alert("Failed to update employee.");
    //     }
    // };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            // Step 1: Update employee details
            await axios.put(
                `http://localhost:5000/api/admin/employees/${selectedEmployee._id}`,
                editForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Step 2: Upload profile image if selected
            if (editForm.profileImageFile) {
                const formData = new FormData();
                formData.append("profileImage", editForm.profileImageFile);
                await axios.put(
                    `http://localhost:5000/api/admin/employees/${selectedEmployee._id}/profile-image`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }
            const updatedResponse = await axios.get("http://localhost:5000/api/admin/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEmployees(updatedResponse.data);
            setFilteredEmployees(updatedResponse.data);
            setEditModalOpen(false);
        } catch {
            alert("Failed to update employee.");
        }
    };


    if (loading) return <p>Loading employees...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Employee List</h2>

            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by Code or Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                />
            </div>

            <ul className="space-y-4">
                {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                        <li key={employee._id} className="bg-white shadow-md rounded-lg p-4">
                            <h3 className="text-xl font-semibold">Employee Code: {employee.epmId}</h3>
                            <p>Name: {employee.name}</p>
                            <p>Contact No: {employee.mobileNo}</p>
                            <p>Joining Date: {new Date(employee.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2 flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    onClick={() => openEditModal(employee)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleDelete(employee._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No employees found.</p>
                )}
            </ul>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="fatherName"
                                placeholder="Father's Name"
                                value={editForm.fatherName}
                                onChange={handleEditChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="course"
                                placeholder="Course"
                                value={editForm.course}
                                onChange={handleEditChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="experience"
                                placeholder="Experience"
                                value={editForm.experience}
                                onChange={handleEditChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="date"
                                name="dob"
                                value={editForm.dob}
                                onChange={handleEditChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile Number"
                                value={editForm.mobile}
                                onChange={handleEditChange}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditForm((prev) => ({ ...prev, profileImageFile: e.target.files[0] }))}
                                className="w-full"
                            />

                            <div className="flex justify-between mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
