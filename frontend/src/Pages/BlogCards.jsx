import React from "react";

const BlogCard = ({ image, title, description }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-sm mx-auto">
            <img src={image} alt={title} className="w-full h-64 object-cover" />
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                    VIEW MORE
                </button>
            </div>
        </div>
    );
};

export default BlogCard;