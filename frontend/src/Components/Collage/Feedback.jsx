import React, { useEffect, useState } from "react";
import axios from "axios";

function Feedback() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/student/contact-us");
                setMessages(response.data.data);
            } catch (err) {
                setError("Failed to fetch messages.");
                console.error(err);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">📬 User Feedback</h1>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {messages.length === 0 ? (
                <p className="text-center">No feedback yet.</p>
            ) : (
                <ul className="space-y-4">
                    {messages.map((msg, idx) => (
                        <li key={msg._id} className="p-4 bg-white shadow rounded border border-gray-200">
                            <h2 className="text-lg font-semibold">{msg.name}</h2>
                            <p className="text-sm text-gray-600">{msg.email}</p>
                            <p className="mt-2">{msg.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Feedback;
