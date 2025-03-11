import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import contactImage from "../assets//images/contact.jpg"; // Ensure this image exists

const Contact = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${contactImage})` }}
      ></div>

      {/* Contact Container */}
      <div className="relative bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl md:flex md:space-x-10">
        {/* Left Section - Contact Details */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-blue-600">Get in Touch</h2>
          <p className="text-gray-600">
            Have any questions? We’d love to hear from you!
          </p>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-blue-600 text-2xl" />
              <p className="text-gray-700">123 College Street, City, Country</p>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-blue-600 text-2xl" />
              <p className="text-gray-700">+123 456 7890</p>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-blue-600 text-2xl" />
              <p className="text-gray-700">info@collegeplacement.com</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-blue-600 text-2xl hover:text-blue-800">
              <FaFacebookF />
            </a>
            <a href="#" className="text-blue-500 text-2xl hover:text-blue-700">
              <FaTwitter />
            </a>
            <a href="#" className="text-blue-800 text-2xl hover:text-blue-900">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-pink-600 text-2xl hover:text-pink-800">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-600">
            Send a Message
          </h3>
          <form className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              required
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="relative w-full max-w-5xl mt-8">
        <iframe
          className="w-full h-64 rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093703!2d144.95373511531766!3d-37.81720997975152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218cee40!2sRMIT%20University!5e0!3m2!1sen!2sin!4v1622454667635!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
