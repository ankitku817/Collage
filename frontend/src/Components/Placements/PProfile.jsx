import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileField = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-600">{label}:</span>{" "}
            {value || "N/A"}
        </p>
    </div>
);

function AdminProfile() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedProfileImage, setUpdatedProfileImage] = useState("");
    const [updatedDepartment, setUpdatedDepartment] = useState("");
    const [updatedDesignation, setUpdatedDesignation] = useState("");
    const [updatedBio, setUpdatedBio] = useState("");
    const [updatedSocialLinks, setUpdatedSocialLinks] = useState({ linkedin: "", twitter: "" });
    const [updatedPermissions, setUpdatedPermissions] = useState([]);
    const [updatedNotifications, setUpdatedNotifications] = useState(true);
    const [updatedAlternateEmail, setUpdatedAlternateEmail] = useState("");

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/employee/employees", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data;
                setAdmin(data);
                setUpdatedEmail(data.email || "");
                setUpdatedProfileImage(data.profileImage || "");
                setUpdatedDepartment(data.department || "");
                setUpdatedDesignation(data.designation || "");
                setUpdatedBio(data.bio || "");
                setUpdatedSocialLinks(data.socialLinks || { linkedin: "", twitter: "" });
                setUpdatedPermissions(data.permissions || []);
                setUpdatedNotifications(data.notifications || true);
                setUpdatedAlternateEmail(data.alternateEmail || "");
            } catch (err) {
                console.error(err);
                setError("Failed to load admin profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                "http://localhost:5000/api/employee/employees",
                {
                    email: updatedEmail,
                    profileImage: updatedProfileImage,
                    department: updatedDepartment,
                    designation: updatedDesignation,
                    bio: updatedBio,
                    socialLinks: updatedSocialLinks,
                    permissions: updatedPermissions,
                    notifications: updatedNotifications,
                    alternateEmail: updatedAlternateEmail,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAdmin(res.data);
            setIsEditing(false);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to update profile.");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading profile...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (!admin) return <div className="text-center mt-10">No profile data found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 md:px-16 lg:px-32">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
                Placement Admin Profile
            </h1>

            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    {/* Profile Image */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-full overflow-hidden shadow border border-gray-300">
                        {updatedProfileImage ? (
                            <img
                                src={updatedProfileImage.startsWith("http") ? updatedProfileImage : `http://localhost:5000/uploads/${updatedProfileImage}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{admin.name || "No Name"}</h2>
                                <p className="text-sm text-gray-500">Admin ID: <span className="text-blue-600 font-medium">{admin.empId}</span></p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Joined:</span>{" "}
                                {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isEditing ? (
                                <>
                                    <InputField label="Email" value={updatedEmail} onChange={setUpdatedEmail} type="email" />
                                    <InputField label="Profile Image URL" value={updatedProfileImage} onChange={setUpdatedProfileImage} />
                                    <InputField label="Department" value={updatedDepartment} onChange={setUpdatedDepartment} />
                                    <InputField label="Designation" value={updatedDesignation} onChange={setUpdatedDesignation} />
                                    <TextAreaField label="Bio" value={updatedBio} onChange={setUpdatedBio} />
                                    <InputField label="LinkedIn" value={updatedSocialLinks.linkedin} onChange={(val) => setUpdatedSocialLinks({ ...updatedSocialLinks, linkedin: val })} />
                                    <InputField label="Twitter" value={updatedSocialLinks.twitter} onChange={(val) => setUpdatedSocialLinks({ ...updatedSocialLinks, twitter: val })} />
                                    <InputField label="Alternate Email" value={updatedAlternateEmail} onChange={setUpdatedAlternateEmail} type="email" />
                                    <InputField label="Permissions (comma-separated)" value={updatedPermissions.join(", ")} onChange={(val) => setUpdatedPermissions(val.split(",").map(p => p.trim()))} />
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            checked={updatedNotifications}
                                            onChange={(e) => setUpdatedNotifications(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-gray-700">Enable Notifications</label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ProfileField label="Email" value={admin.email} />
                                    <ProfileField label="Department" value={admin.department} />
                                    <ProfileField label="Designation" value={admin.designation} />
                                    <ProfileField label="Bio" value={admin.bio} />
                                    <ProfileField label="LinkedIn" value={
                                        admin.socialLinks?.linkedin ? (
                                            <a href={admin.socialLinks.linkedin} target="_blank" className="text-blue-500 underline">LinkedIn</a>
                                        ) : "N/A"
                                    } />
                                    <ProfileField label="Twitter" value={
                                        admin.socialLinks?.twitter ? (
                                            <a href={admin.socialLinks.twitter} target="_blank" className="text-blue-500 underline">Twitter</a>
                                        ) : "N/A"
                                    } />
                                    <ProfileField label="Alternate Email" value={admin.alternateEmail} />
                                    <div>
                                        <p className="text-sm text-gray-700 font-semibold text-blue-600">Permissions:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {admin.permissions?.length > 0 ? admin.permissions.map((perm, i) => (
                                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{perm}</span>
                                            )) : "N/A"}
                                        </div>
                                    </div>
                                    <ProfileField label="Notifications" value={admin.notifications ? "Enabled" : "Disabled"} />
                                </>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleEditToggle}
                                className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={handleUpdateProfile}
                                    className="ml-3 px-4 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Input Field
const InputField = ({ label, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm text-gray-700 font-medium mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
    </div>
);

// Reusable Textarea Field
const TextAreaField = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm text-gray-700 font-medium mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
    </div>
);

export default AdminProfile;
