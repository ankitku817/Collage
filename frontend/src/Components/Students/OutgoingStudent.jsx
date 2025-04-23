import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OutgoingStudent() {
    const [finalSelected, setFinalSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const companyId = "6807ef42f0035c1765ef6481";

    useEffect(() => {
        const fetchFinalSelectedStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/student/getSelectedStudents/${companyId}`);
                if (response.data.success && response.data.data.finalSelectedStudents) {
                    setFinalSelected(response.data.data.finalSelectedStudents);
                } else {
                    setError('No final selected students found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch final selected students.');
            } finally {
                setLoading(false);
            }
        };

        fetchFinalSelectedStudents();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Placed Students</h2>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : finalSelected.length === 0 ? (
                <p className="text-gray-600">No students selected.</p>
            ) : (
                <ul className="list-disc list-inside ml-4 text-gray-700">
                    {finalSelected.map((rollNo, i) => (
                        <li key={i}>{rollNo}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OutgoingStudent;
