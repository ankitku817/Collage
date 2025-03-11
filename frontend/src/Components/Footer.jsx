import { Link } from "react-router-dom";

const Footer = () => {
    const getYear = () => new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white p-6">
            {/* Contact Info */}
            <div className="container mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Contact Us */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Contact Us</h2>
                    <p>12 Km Stone, Amritsar-Jalandhar, G.T Road, Amritsar-143001 (PB), India</p>
                    <p className="mt-2">📞 8872009951 | 8872009950 (24/7 Support Line)</p>
                    <p>✉️ <a href="mailto:admission@acetedu.in" className="text-blue-400 hover:underline">admission@acetedu.in</a></p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Quick Links</h2>
                    <ul className="space-y-1">
                        <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                        <li><Link to="/scholarship" className="hover:text-blue-400">Scholarship</Link></li>
                        <li><Link to="/blog" className="hover:text-blue-400">Blog</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link></li>
                        <li><Link to="/documents" className="hover:text-blue-400">Essential Documents</Link></li>
                        <li><Link to="/disclosure" className="hover:text-blue-400">Mandatory Disclosure</Link></li>
                        <li><Link to="/anti-ragging" className="hover:text-blue-400">Anti Ragging</Link></li>
                    </ul>
                </div>

                {/* Google Partner & Design Info */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Google Partner</h2>
                    <p>We are a recognized Google Partner ensuring top-notch services.</p>
                    <p className="mt-4 text-sm">
                        <span className="font-bold">Design & Maintained By:</span> Digital Cell, AGC
                    </p>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="mt-6 text-center border-t border-gray-700 pt-4">
                © {getYear()} College Placement System | All rights reserved |
                <span className="font-bold">
                    <Link to="https://agcamritsar.in/" className="text-blue-400 hover:underline ml-1" target="_blank">AGC Amritsar</Link>
                </span>
            </div>
        </footer>
    );
};

export default Footer;
