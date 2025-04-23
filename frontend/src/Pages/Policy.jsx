import React from "react";

const policies = [
    {
        title: "Eligibility Criteria",
        description:
            "Minimum attendance of 75%, CGPA 6.0 and above, and no active backlogs allowed for participating in placements.",
    },
    {
        title: "Registration",
        description:
            "Students must register on the placement portal and submit a resume in the approved format before the deadline.",
    },
    {
        title: "Dream/Non-Dream Offers",
        description:
            "A Dream offer is defined as a package above ₹10 LPA. Students who receive a Dream offer are not allowed to sit for further placements.",
    },
    {
        title: "Single Offer Rule",
        description:
            "Once a student is placed, they are out of the placement process, unless allowed under special categories like Dream/Internship/PSU.",
    },
    {
        title: "Internship Policy",
        description:
            "Internships will be governed by a separate policy. Full-time PPOs (Pre-Placement Offers) will be considered as placement offers.",
    },
    {
        title: "Backout Policy",
        description:
            "If a student backs out after accepting an offer or fails to attend interviews, they may be blacklisted from further drives.",
    },
    {
        title: "Discipline & Professionalism",
        description:
            "Formal attire is compulsory during interviews. Respect towards recruiters and punctuality is mandatory.",
    },
];

const PlacementPolicy = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
                College Placement Policy
            </h1>
            <div className="space-y-6">
                {policies.map((policy, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300"
                    >
                        <h2 className="text-xl font-semibold text-blue-800">
                            {policy.title}
                        </h2>
                        <p className="mt-2 text-gray-700">{policy.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlacementPolicy;