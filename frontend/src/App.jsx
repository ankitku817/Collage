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
import AdminProfile from "./Components/Placements/PProfile";
import View_Students from "./Components/Placements/View_Students";
import View_Student from "./Components/Students/View-Students";
import Incoming_Companies from "./Components/Students/Incoming_Companies";
import Incoming_Company from "./Components/Placements/Incoming_Company";
import Applied_students from "./Components/Placements/Applied_students"
import Outgoing_Companies from "./Components/Students/Outgoing_Companies";
import OngoingRecruitment from "./Components/Students/OngoingRecruitment";
import Applied_companies from "./Components/Students/Applied_companies";
import Outgoing_Company from "./Components/Placements/Outgoing_Company";
import OutgoingStudents from "./Components/Placements/OutgoingStudents";
import StudentList from "./Components/Collage/StudentList";
import PlacementPolicy from './Pages/Policy'
import Feedback from "./Components/Collage/Feedback";
import OutgoingStudent from "./Components/Students/OutgoingStudent";
import OngoingRecruitments from "./Components/Placements/OngoingRecruitments";
import EmployeeList from "./Components/Collage/EmployeeList";
import BlogsSection from './Components/BlogsSection'
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
          <Route path="/blog" element={<BlogsSection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/collage-homepage" element={<HomePage />} />
          <Route path="/student-homepage" element={<HomePages />} />
          <Route path="/placement-homepage" element={<Placement_Home />} />
          <Route path="/placement-homepages/students" element={<View_Students />} />
          <Route path="/placement-homepages/companies" element={<Incoming_Company />} />
          <Route path="/placement-homepages/results" element={<Outgoing_Company />} />
          <Route path="/placement-homepages/applied-students" element={<Applied_students />} />
          <Route path="/placement-homepages/recruitments" element={<OngoingRecruitments />} />
          <Route path="/collage-homepage/profile" element={<Profile />} />
          <Route path="/collage-homepage/feedback-response" element={<Feedback />} />
          <Route path="/student-homepage/profile" element={<SProfile />} />
          <Route path="/placement-homepages/profile" element={<AdminProfile />} />
          <Route path="/placement-homepages/outgoing-students" element={<OutgoingStudents />} />
          <Route path="/placement-homepages/policy" element={<PlacementPolicy />} />
          <Route path="/student-homepage/students" element={<View_Student />} />
          <Route path="/student-homepage/outgoing-students" element={<OutgoingStudent />} />
          <Route path="/student-homepage/incoming-companies" element={<Incoming_Companies />} />
          <Route path="/student-homepage/applied-comapnies" element={<Applied_companies />} />
          <Route path="/student-homepage/recruitments" element={<OngoingRecruitment />} />
          <Route path="/student-homepage/policy" element={<PlacementPolicy />} />
          <Route path="/student-homepage/results" element={<Outgoing_Companies />} />
          <Route path="/collage-homepage/students" element={<StudentList />} />
          <Route path="/collage-homepage/employees" element={<EmployeeList />} />
          <Route path="/collage-homepage/policy" element={<PlacementPolicy />} />
        </Routes>
      </main>
      <footer className="bottom-0 left-0 w-full bg-gray-900 text-white p-4">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
