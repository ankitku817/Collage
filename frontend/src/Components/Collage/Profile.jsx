import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { format } from "date-fns";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    collegeName: "",
    dateOfBirth: "",
    joiningDate: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized! Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/admin-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          collegeName: response.data.collegeName || "",
          dateOfBirth: response.data.dateOfBirth || "",
          joiningDate: response.data.joiningDate || "",
          profileImage: response.data.profileImage || null,
        });
      } catch (err) {
        setError("Failed to fetch admin details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleUpdateProfile = async () => {
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please login first.");
      return;
    }

    const updatedFormData = new FormData();
    updatedFormData.append("name", formData.name);
    updatedFormData.append("email", formData.email);
    updatedFormData.append("phone", formData.phone);
    updatedFormData.append("collegeName", formData.collegeName);
    updatedFormData.append("dateOfBirth", formData.dateOfBirth);
    updatedFormData.append("joiningDate", formData.joiningDate);
    if (formData.profileImage) {
      updatedFormData.append("profileImage", formData.profileImage);
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/admin-update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: updatedFormData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Profile update failed!");
      }
      setSuccessMessage("Profile updated successfully!");
      setAdmin(data.updatedAdmin);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "An error occurred while updating the profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Admin Profile</h1>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col items-center mb-6">
        {admin?.profileImage ? (
          <img
            src={`http://localhost:5000/uploads/${admin.profileImage}`}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-lg"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-5xl">
            <FaUser className="text-gray-600" />
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {[
            { label: "Name", name: "name", type: "text", icon: <FaUser /> },
            { label: "Email", name: "email", type: "email", icon: <FaEnvelope /> },
            { label: "Phone", name: "phone", type: "tel", icon: <FaPhone /> },
            { label: "College Name", name: "collegeName", type: "text", icon: <FaBuilding /> },
            { label: "Date of Birth", name: "dateOfBirth", type: "date", icon: <FaCalendarAlt /> },
            { label: "Joining Date", name: "joiningDate", type: "date", icon: <FaCalendarAlt /> },
          ].map((field) => (
            <div key={field.name} className="flex items-center border rounded p-2">
              {field.icon}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="ml-2 w-full outline-none"
              />
            </div>
          ))}

          <div className="flex items-center border rounded p-2">
            <FaUpload />
            <input type="file" accept="image/*" onChange={handleFileChange} className="ml-2 w-full outline-none" />
          </div>

          <div className="flex gap-4 mt-4">
            <button onClick={handleUpdateProfile} className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center">
              <FaSave className="mr-2" /> Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded w-full flex items-center justify-center">
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {admin ? (
            <>
              {[
                { label: "Name", value: admin.name, icon: <FaUser /> },
                { label: "Email", value: admin.email, icon: <FaEnvelope /> },
                { label: "Phone", value: admin.phone, icon: <FaPhone /> },
                { label: "College", value: admin.collegeName, icon: <FaBuilding /> },
                { label: "Date of Birth", value: format(new Date(admin.dateOfBirth), "dd MMM yyyy"), icon: <FaCalendarAlt /> },
                { label: "Joining Date", value: format(new Date(admin.joiningDate), "dd MMM yyyy"), icon: <FaCalendarAlt /> },
              ].map((field) => (
                <p key={field.label} className="border-b pb-2 flex items-center">
                  {field.icon} <span className="ml-2"><strong>{field.label}:</strong> {field.value}</span>
                </p>
              ))}

              <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full flex items-center justify-center">
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            </>
          ) : (
            <p className="text-red-500">No admin data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
