import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setMobileRoomsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const hideNavbar = location.pathname === "/booking" || location.pathname === "/booking/donatela" || location.pathname === "/login" || location.pathname === "/dashboard" || location.pathname === "/guest-info-and-policy"
  || location.pathname === "/resort-reviews" || location.pathname === "/payment" || location.pathname === "/confirmation" || location.pathname === "/infohotel"; // Modify condition as per your routes


  if (hideNavbar) return null; // If on /booking, return nothing (hide navbar)


  return (
    <nav className="fixed top-0 left-0 w-full bg-[#D3D0D0] shadow-md h-20 z-50 flex items-center justify-between px-10 py-4">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Logo" className="h-30 w-auto" />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-25 text-gray-700 font-medium mr-50%">
        <li className="hover:text-green-600 cursor-pointer border-b-2 border-transparent hover:border-green-600">
          <Link
            to="/"
            className={`pb-1 ${location.pathname === "/" ? "text-green-600 font-semibold border-green-600" : ""}`}
          >
            Home
          </Link>
        </li>
        <li className="relative group cursor-pointer hover:border-b-2 hover:border-green-600">
          <span>Rooms ▼</span>
          <ul className="absolute top-5 left-20 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-white shadow-lg py-2 w-44 rounded-md">
            <li>
              <Link to="/standard" className="block px-4 py-2 hover:bg-gray-100">Standard Room</Link>
            </li>
            <li>
              <Link to="/junior" className="block px-4 py-2 hover:bg-gray-100">Junior Suite</Link>
            </li>
            <li>
              <Link to="/superior" className="block px-4 py-2 hover:bg-gray-100">Superior Suite</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/facilities" className="hover:text-green-600 cursor-pointer hover:border-b-2 hover:border-green-600">
            Facilities
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-green-600 cursor-pointer hover:border-b-2 hover:border-green-600">
            Contact Us
          </Link>
        </li>
  
      </ul>
    <ul className="hidden md:flex space-x-4 text-gray-900 font-bold">
  <li>
    <Link
      to="/login"
      className="
        bg-green-700
        text-white px-6 py-2 rounded-lg
        font-semibold shadow
        hover:from-white-600 hover:to-green-800
        hover:shadow-lg hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
        active:scale-99
        transition-all duration-200
        flex items-center gap-2
      "
    >
    
    
      Login
    </Link>
  </li>
</ul>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Right Section (Desktop) */}
      

      {/* Mobile Menu Full */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md rounded text-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] p-4" : "max-h-0 p-0"
        }`}
      >
        <Link to="/" className="p-2 border-b" onClick={() => setMenuOpen(false)}>Home</Link>

        {/* Mobile Rooms Dropdown */}
        <button
          onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
          className="w-full text-left p-2 border-b flex justify-between items-center"
        >
          <span>Rooms</span>
          <span>{mobileRoomsOpen ? "▲" : "▼"}</span>
        </button>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileRoomsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Link to="/standard" className="block p-2 hover:bg-gray-200 rounded" onClick={() => setMenuOpen(false)}>
            Standard Room
          </Link>
          <Link to="/junior" className="block p-2 hover:bg-gray-200 rounded" onClick={() => setMenuOpen(false)}>
            Junior Suite
          </Link>
          <Link to="/superior" className="block p-2 hover:bg-gray-200 rounded" onClick={() => setMenuOpen(false)}>
            Superior Suite
          </Link>
        </div>

        <Link to="/facilities" className="p-2 border-b" onClick={() => setMenuOpen(false)}>Facilities</Link>
        <Link to="/contact" className="p-2 border-b" onClick={() => setMenuOpen(false)}>Contact Us</Link>
        <Link to="/booking" className="p-2 border-b" onClick={() => setMenuOpen(false)}>Book Now</Link>
        <Link to="/login" className="p-2" onClick={() => setMenuOpen(false)}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
