import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import AdminRegister from "./Pages/AdminRegister";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Services from "./Pages/Services";
import Home from "./Pages/Home";
import HomePage from "./Components/Collage/HomePage";
import HomePages from "./Components/Students/HomePages";
import Placement_Home from "./Components/Placements/Placement_Home";
import Profile from "./Components/Collage/Profile";
import SProfile from "./Components/Students/SProfile";
import View_Students from "./Components/Placements/View_Students";
import Incoming_Company from "./Components/Placements/Incoming_Company";
import StudentList from "./Components/Collage/StudentList";
import EmployeeList from "./Components/Collage/EmployeeList";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </header>
      <main className="flex-grow mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/collage-homepage" element={<HomePage />} />
          <Route path="/student-homepage" element={<HomePages />} />
          <Route path="/placement-homepage" element={<Placement_Home />} />
          <Route path="/placement-homepages/students" element={<View_Students />} />
          <Route path="/placement-homepages/companies" element={<Incoming_Company />} />
          <Route path="/collage-homepage/profile" element={<Profile />} />
          <Route path="/student-homepage/profile" element={<SProfile />} />
          <Route path="/collage-homepage/students" element={<StudentList />} />
          <Route path="/collage-homepage/employees" element={<EmployeeList />} />

        </Routes>
      </main>
      <footer className="bottom-0 left-0 w-full bg-gray-900 text-white p-4">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
