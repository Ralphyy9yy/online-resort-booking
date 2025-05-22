import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Navbar from "./components/Navbar";
import Standard from "./pages/Rooms/Standard";
import Junior from "./pages/Rooms/Junior";
import Superior from "./pages/Rooms/Superior";
import Facilities from "./pages/Facilities";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage"; // Import the new BookingPage component
import Dashboard from "./components/Dashboard"; // Import the new Dashboard component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import GuestInfoAndPolicy from "./pages/GuestInfoAndPolicy";
import ResortReviewsPage from "./pages/ResortReviewsPage";  
import InfoHotel from "./pages/InfoHotel"; // Capital I and H

import PaymentProcessing from "./components/PaymentProcessing";
import Confirmation from "./components/Confirmation";
function App() {
  return (
    <Router>

      <div className="min-h-screen bg-gray-100">
        <Navbar />{/* Navbar Component */}
        <Routes>

          <Route path="/" element={<Home />} />
          
          <Route path="/standard" element={<Standard />} />
          <Route path="/junior" element={<Junior />} />
          <Route path="/superior" element={<Superior />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<BookingPage />} /> {/* New route */}
          <Route path="/login" element={<LoginPage />} /> {/* New route */}
          <Route path="/guest-info-and-policy" element={<GuestInfoAndPolicy />} /> {/* New route */}
          <Route path="/resort-reviews" element={<ResortReviewsPage />} /> {/* New route */}
          <Route path="/payment" element={<PaymentProcessing />} /> {/* New route */}
          <Route path="/confirmation" element={<Confirmation />} /> {/* New route */}
          {/* Add more routes as needed */}
          {/* Protected Route for Dashboard */}
          {/* Add more routes as needed */}
          {/* Protected Route for Dashboard */}
          <Route path="/infoHotel" element={<InfoHotel />} />

          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

          {/* Add more routes as needed */}
       


        </Routes>
      </div>

    </Router>
  );
}

export default App;
