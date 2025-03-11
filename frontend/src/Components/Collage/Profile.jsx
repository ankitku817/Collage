import React, { useEffect, useState } from "react";
import axios from "axios";

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

        console.log("Admin Data:", response.data);
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

      const text = await response.text();
      console.log("Response Text:", text);

      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.message || "Profile update failed!");
        }
        setSuccessMessage("Profile updated successfully!");
        setAdmin(data.updatedAdmin);
        setIsEditing(false);
      } catch (jsonError) {
        setError("Unexpected server response. Check backend logs.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating the profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Profile</h1>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col items-center mb-6">
        {admin?.profileImage ? (
          <img
            src={`http://localhost:5000/uploads/${admin.profileImage}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-3xl">👤</span>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "tel" },
            { label: "College Name", name: "collegeName", type: "text" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Joining Date", name: "joiningDate", type: "date" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="font-semibold">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="font-semibold">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border rounded" />
          </div>

          <div className="flex gap-4 mt-4">
            <button onClick={handleUpdateProfile} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {admin ? (
            <>
              {[
                { label: "Name", value: admin.name },
                { label: "Email", value: admin.email },
                { label: "Phone", value: admin.phone },
                { label: "College Name", value: admin.collegeName },
                { label: "Date of Birth", value: admin.dateOfBirth || "N/A" },
                { label: "Joining Date", value: admin.joiningDate || "N/A" },
              ].map((field) => (
                <p key={field.label} className="border-b pb-2">
                  <strong>{field.label}:</strong> {field.value}
                </p>
              ))}

              <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
                Edit Profile
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
