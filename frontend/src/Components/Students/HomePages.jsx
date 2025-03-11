import React from "react";
import { Link } from "react-router-dom";

const HomePages = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">College Placement</h1>
                <div className="space-x-6">
                    <Link to="/student-homepage" className="hover:underline">Home</Link>
                    <Link to="/student-homepage/jobs" className="hover:underline">Jobs</Link>
                    <Link to="/student-homepage/profile" className="hover:underline">Profile</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-blue-500 text-white text-center py-20 px-4">
                <h2 className="text-4xl font-extrabold">Find Your Dream Job</h2>
                <p className="mt-4 text-lg">Explore top companies and apply for jobs that match your skills.</p>
                <Link to="/jobs">
                    <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                        Explore Jobs
                    </button>
                </Link>
            </header>

            {/* Featured Jobs */}
            <section className="py-12 px-6">
                <h3 className="text-3xl font-semibold text-center mb-6">Featured Job Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example Job Cards */}
                    <JobCard title="Software Engineer" company="Google" location="Remote" />
                    <JobCard title="Data Analyst" company="Amazon" location="New York, USA" />
                    <JobCard title="Frontend Developer" company="Microsoft" location="Bangalore, India" />
                </div>
            </section>

            {/* Partner Companies */}
            <section className="bg-gray-200 py-12 text-center">
                <h3 className="text-3xl font-semibold">Top Hiring Companies</h3>
                <div className="flex justify-center gap-10 mt-6 flex-wrap">
                    <img src="https://tse3.mm.bing.net/th?id=OIP.qiidhihdaOqzaYRIl950aQHaE8&pid=Api&P=0&h=180" alt="Wipro" className="h-12" />
                    <img src="https://tse1.mm.bing.net/th?id=OIP.ZlzwoB6b_VEZ63CRj4R5qgHaC9&pid=Api&P=0&h=180" alt="Infoysis" className="h-12" />
                    <img src="https://thumbs.dreamstime.com/b/utrecht-netherlands-may-capgemini-logo-sign-building-french-multinational-information-technology-services-consulting-280685793.jpg" alt="Microsoft" className="h-12" />
                    <img src="https://tse1.mm.bing.net/th?id=OIP.uJ7t8IOM9eroFbp5zKIGTQHaEq&pid=Api&P=0&h=180" alt="TCS" className="h-12" />
                </div>
            </section>
        </div>
    );
};

// Job Card Component
const JobCard = ({ title, company, location }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold">{title}</h4>
            <p className="text-gray-700">{company}</p>
            <p className="text-gray-500">{location}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Apply Now
            </button>
        </div>
    );
};

export default HomePages;
