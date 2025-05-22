import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBed, FaUser, FaWifi, FaTv, FaWater, FaCoffee } from "react-icons/fa";
import { MdOutlineCalendarToday, MdAir } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import booking from "../assets/booking.jpg";

const BookingPage = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list view
  const [loading, setLoading] = useState(true);
  const [isHotelInfoModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const todayFormatted = today.toISOString().split("T")[0];
    const nextDayFormatted = nextDay.toISOString().split("T")[0];

    setCheckIn(todayFormatted);
    setCheckOut(nextDayFormatted);

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/rooms");
        // Transform the data to include custom images
        const transformedData = response.data.map((room) => ({
          ...room,
          image: getImagePath(room),
        }));
        setRoomData(transformedData);
      } catch (error) {
        console.error("Error fetching rooms", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getMinCheckOutDate = () => {
    if (!checkIn) return new Date().toISOString().split("T")[0];
    const minDate = new Date(checkIn);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split("T")[0];
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);

    // If check-out is before or equal to new check-in, reset check-out to the minimum allowed
    if (checkOut && new Date(checkOut) <= new Date(newCheckIn)) {
      setCheckOut(getMinCheckOutDate());
    }
  };

  // Function to get image path based on room type
 const getImagePath = (room) => {
  if (room && room.room_image) {
    return `http://localhost:5000/api/rooms/image/${room.room_image}`;
  }
  // Fallback to a local default image in your public folder
  return "/default-image.jpg";
};


  const handleAddRoom = (room) => {
    const exists = selectedRooms.find((r) => r.room_id === room.room_id);
    if (exists) return;
    setSelectedRooms([...selectedRooms, { ...room, quantity: 1 }]);
  };

  const increaseQty = (idx) => {
    const updated = [...selectedRooms];
    if (updated[idx].quantity < updated[idx].available_rooms) {
      updated[idx].quantity++;
      setSelectedRooms(updated);
    } else {
      alert(`Sorry, only ${updated[idx].available_rooms} rooms available.`);
    }
  };

  const decreaseQty = (idx) => {
    const updated = [...selectedRooms];
    if (updated[idx].quantity > 1) {
      updated[idx].quantity--;
      setSelectedRooms(updated);
    } else {
      updated.splice(idx, 1);
      setSelectedRooms(updated);
    }
  };

  const handleBooking = async () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room to book");
      return;
    }

    const bookingData = {
      checkIn,
      checkOut,

      rooms: selectedRooms.map((room) => ({
        id: room.room_id,
        name: room.name,
        price: room.price,

        quantity: room.quantity,
      })),
    };

    navigate("/guest-info-and-policy", { state: { bookingData } });
  };

  // Calculate total nights between check-in and check-out
  const calculateNights = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = calculateNights();

  // Determine room amenities based on room type and price
  const getRoomAmenities = (room) => {
    const baseAmenities = [
      <FaWifi key="wifi" title="Free WiFi" />,
      <FaTv key="tv" title="Smart TV" />,
    ];

    // Add more amenities based on room price or type
    if (room.price > 15000) {
      baseAmenities.push(<MdAir key="ac" title="Air Conditioning" />);
      baseAmenities.push(<FaWater key="water" title="Bottled Water" />);
    }

    if (room.price > 20000) {
      baseAmenities.push(<FaCoffee key="coffee" title="Coffee Maker" />);
    }

    return baseAmenities;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const formVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <motion.nav
        className="bg-green-800 text-white px-6 py-4 flex justify-between items-center relative"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Link to="/" className="font-semibold text-lg hover:text-green-300">
          DONATELA RESORT
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:flex gap-6 text-sm block absolute lg:relative bg-green-800 w-full lg:w-auto top-full left-0 lg:top-0 lg:flex-row flex-col items-center lg:bg-transparent py-4 lg:py-0 z-50"
            >
              <li>
                <Link to="/" className="hover:text-green-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/infohotel" className="hover:text-green-300">
                  Hotel Info
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-green-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/resort-reviews" className="hover:text-green-300">
                  Reviews
                </Link>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
        <ul className="hidden lg:flex gap-6 text-sm">
          <li>
            <Link to="/" className="hover:text-green-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/infohotel">Hotel Info</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-green-300">
              Login
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-green-300">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/resort-reviews" className="hover:text-green-300">
              Reviews
            </Link>
          </li>
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[300px]"
        style={{ backgroundImage: `url(${booking})` }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Book Your Perfect Stay
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            Find the ideal room for your needs
          </motion.p>
        </motion.div>
        {isHotelInfoModalOpen && <HotelInfoModal />}
      </div>

      {/* Booking Form */}
      <motion.div
        className="bg-white shadow-lg mx-4 md:mx-auto -mt-10 relative z-10 rounded-lg p-6 max-w-4xl"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-wrap justify-between gap-9">
          <motion.div
            className="flex-1 min-w-[200px]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check In
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <MdOutlineCalendarToday className="mr-2 text-gray-500" />
              <input
                type="date"
                value={checkIn}
                onChange={handleCheckInChange}
                className="outline-none w-full"
                min={new Date().toISOString().split("T")[0]} // No past dates
              />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 min-w-[200px]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check Out
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <MdOutlineCalendarToday className="mr-2 text-gray-500" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="outline-none w-full"
                min={getMinCheckOutDate()} // Must be after check-in
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Room Display Section with View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Available Rooms</h2>
          <motion.div className="flex gap-2" whileHover={{ scale: 1.05 }}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </motion.div>
        ) : roomData.length === 0 ? (
          <motion.div
            className="text-center py-12"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <FaBed size={60} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              No rooms available
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {roomData.map((room, index) => {
                  const isSelected = selectedRooms.find(
                    (r) => r.room_id === room.room_id
                  );
                  return (
                    <motion.div
                      key={room.room_id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-xl"
                      variants={childVariants}
                      whileHover={{ y: -5 }}
                      custom={index}
                    >
                      <div className="relative">
                        <img
                          src={getImagePath(room)}
                          alt={room.room_type_name || "Room Image"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-image.jpg";
                          }}
                        />

                        {room.promo && (
                          <motion.span
                            className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: 0.2,
                            }}
                          >
                            PROMO PRICE
                          </motion.span>
                        )}
                        {room.available_rooms <= 1 && (
                          <motion.span
                            className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: 0.2,
                            }}
                          >
                            Unavailable!
                          </motion.span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 mt-2">
                          <FaUser />
                          <span className="text-sm">
                            Max {room.capacity} guests
                          </span>
                        </div>

                        <div className="flex gap-3 mt-3">
                          {getRoomAmenities(room).map((icon, idx) => (
                            <motion.div
                              key={idx}
                              className="text-gray-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 * idx }}
                            >
                              {icon}
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-between items-end">
                          <div>
                            <p className="text-xs text-gray-500">
                              Price per night
                            </p>
                            <p className="text-green-600 font-bold text-xl">
                              ₱ {room.price.toLocaleString()}
                            </p>
                          </div>
                          {isSelected ? (
                            <motion.button
                              className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              Added
                            </motion.button>
                          ) : (
                            <motion.button
                              className={`${
                                room.available_rooms > 0
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              } text-sm px-4 py-2 rounded-md`}
                              onClick={() =>
                                room.available_rooms > 0 && handleAddRoom(room)
                              }
                              disabled={room.available_rooms <= 0}
                              whileHover={
                                room.available_rooms > 0 ? { scale: 1.05 } : {}
                              }
                              whileTap={
                                room.available_rooms > 0 ? { scale: 0.95 } : {}
                              }
                            >
                              {room.available_rooms > 0
                                ? "Select Room"
                                : "Fully Booked"}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {roomData.map((room, index) => {
                  const isSelected = selectedRooms.find(
                    (r) => r.room_id === room.room_id
                  );
                  return (
                    <motion.div
                      key={room.room_id}
                      className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4"
                      variants={childVariants}
                      whileHover={{
                        y: -3,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      custom={index}
                    >
                      <div className="relative md:w-1/3">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-32 md:h-full object-cover rounded-md"
                          onError={(e) => {
                            console.error(
                              `Failed to load image for ${room.name}`
                            );
                            e.target.src = roomImageMap.default;
                          }}
                        />
                        {room.promo && (
                          <motion.span
                            className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: 0.2,
                            }}
                          >
                            PROMO PRICE
                          </motion.span>
                        )}
                        {room.available_rooms <= 1 && (
                          <motion.span
                            className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: 0.2,
                            }}
                          >
                            Unavailable!
                          </motion.span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-600 mt-2">
                            <FaUser />
                            <span className="text-sm">
                              Max {room.capacity} guests
                            </span>
                          </div>

                          <div className="flex gap-4 mt-3">
                            {getRoomAmenities(room).map((icon, idx) => (
                              <motion.div
                                key={idx}
                                className="text-gray-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 * idx }}
                              >
                                {icon}
                              </motion.div>
                            ))}
                          </div>

                          <p className="text-gray-600 mt-3 text-sm">
                            {room.description ||
                              `Experience comfort and luxury in our spacious ${
                                room.name
                              }. Perfect for ${
                                room.capacity > 2 ? "families" : "couples"
                              }.`}
                          </p>

                          <div className="mt-2 text-sm text-green-600">
                            <span className="font-semibold">
                              {room.available_rooms}
                            </span>{" "}
                            rooms left at this price
                          </div>
                        </div>

                        <div className="mt-auto pt-4 flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">
                              Price per night
                            </p>
                            <p className="text-green-600 font-bold text-xl">
                              ₱ {room.price.toLocaleString()}
                            </p>
                          </div>
                          {isSelected ? (
                            <motion.button
                              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md"
                              whileTap={{ scale: 0.95 }}
                            >
                              Added to Booking
                            </motion.button>
                          ) : (
                            <motion.button
                              className={`${
                                room.available_rooms > 0
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              } px-6 py-2 rounded-md`}
                              onClick={() =>
                                room.available_rooms > 0 && handleAddRoom(room)
                              }
                              disabled={room.available_rooms <= 0}
                              whileHover={
                                room.available_rooms > 0 ? { scale: 1.05 } : {}
                              }
                              whileTap={
                                room.available_rooms > 0 ? { scale: 0.95 } : {}
                              }
                            >
                              {room.available_rooms > 0
                                ? "Select Room"
                                : "Sold Out"}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Booking Summary Floating Panel */}
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 p-4 lg:hidden z-20"
        initial={{ y: 100 }}
        animate={{ y: selectedRooms.length > 0 ? 0 : 100 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Total ({selectedRooms.length} rooms, {nights} nights)
            </p>
            <p className="text-lg font-bold text-green-700">
              ₱{" "}
              {selectedRooms
                .reduce((total, r) => total + r.price * r.quantity * nights, 0)
                .toLocaleString()}
            </p>
          </div>
          <motion.button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
            onClick={() =>
              document
                .getElementById("bookingSummary")
                .scrollIntoView({ behavior: "smooth" })
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Booking
          </motion.button>
        </div>
      </motion.div>

      {/* Booking Summary */}
      <motion.div
        id="bookingSummary"
        className="max-w-7xl mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Booking Summary
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            className="lg:w-2/3"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Selected Rooms</h3>

              {selectedRooms.length === 0 ? (
                <motion.div
                  className="text-center text-gray-400 py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <FaBed size={50} className="mx-auto mb-3" />
                  </motion.div>
                  <p>No rooms selected yet</p>
                  <p className="text-sm mt-2">
                    Browse our available rooms above and add them to your
                    booking
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {selectedRooms.map((room, idx) => (
                      <motion.div
                        key={room.room_id}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                        variants={childVariants}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                        }}
                      >
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {room.name}
                          </h4>
                          <div className="text-sm text-gray-600">
                            Max {room.capacity} guests
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            {room.quantity} x ₱ {room.price.toLocaleString()}{" "}
                            per night
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => decreaseQty(idx)}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </motion.button>
                          <motion.span
                            className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium"
                            key={room.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {room.quantity}
                          </motion.span>
                          <motion.button
                            className="text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => increaseQty(idx)}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/3"
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Details</h3>

              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                <motion.div
                  className="text-sm text-gray-600"
                  variants={childVariants}
                >
                  <strong>Check-in:</strong> {checkIn}
                </motion.div>

                <motion.div
                  className="text-sm text-gray-600"
                  variants={childVariants}
                >
                  <strong>Check-out:</strong> {checkOut}
                </motion.div>

                <motion.div
                  className="text-sm text-gray-600"
                  variants={childVariants}
                >
                  <strong>Total Nights:</strong> {nights}
                </motion.div>

                <motion.div
                  className="text-sm text-gray-600 mb-4"
                  variants={childVariants}
                >
                  <strong>Total Guests:</strong>{" "}
                  {selectedRooms.reduce(
                    (acc, room) => acc + room.capacity * room.quantity,
                    0
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-between items-center text-lg font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p>Total Cost:</p>
                <motion.p
                  className="text-green-600"
                  key={selectedRooms.reduce(
                    (total, r) => total + r.price * r.quantity * nights,
                    0
                  )}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ₱{" "}
                  {selectedRooms
                    .reduce(
                      (total, r) => total + r.price * r.quantity * nights,
                      0
                    )
                    .toLocaleString()}
                </motion.p>
              </motion.div>

              <div className="mt-6">
                <motion.button
                  onClick={handleBooking}
                  className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Book
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800 text-white py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 EASYSTAY. All rights reserved.</p>
          <p className="text-sm">Privacy Policy | Terms & Conditions</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default BookingPage;
