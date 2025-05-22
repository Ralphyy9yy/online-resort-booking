import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function GuestInfoAndPolicy() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    countryCode: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);
  const [totalNights, setTotalNights] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingSuccessData) {
      navigate("/payment", { state: { bookingDetails: bookingSuccessData } });
    }
  }, [bookingSuccessData, navigate]);

  useEffect(() => {
    if (bookingData && bookingData.checkIn && bookingData.checkOut) {
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setTotalNights(nights);
    }
  }, [bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    if (!bookingData || !bookingData.rooms) return 0;
    return bookingData.rooms.reduce(
      (total, room) => total + room.price * room.quantity * totalNights,
      0
    );
  };

  const handleBookNow = async () => {
    if (!bookingData) {
      alert("No booking data available.");
      return;
    }
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile
    ) {
      alert("Please fill out all required guest information.");
      return;
    }
    if (!acceptTerms) {
      alert(
        "Please acknowledge and accept the Terms of Cancellation Policy & Hotel Policy."
      );
      return;
    }

    const payload = {
      guest: formData,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      rooms: bookingData.rooms.map((room) => ({
        id: room.id,
        quantity: room.quantity,
        price: room.price,
      })),
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        alert("Booking Successful!");
        const bookingId = response.data.bookingId;
        const total = calculateTotal();
        const transformedBookingData = {
          bookingId: bookingId,
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          rooms: payload.rooms,
          guestInfo: payload.guest,
          total: total,
          totalNights: totalNights,
        };
        setBookingSuccessData(transformedBookingData);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 tracking-wide">EASY STAY</h1>
            <p className="uppercase text-sm text-emerald-600 tracking-widest">
              Resort and Sanctuary
            </p>
          </div>
          <div className="text-center">
            <a href="/booking" className="block">
              <div className="w-10 h-10 bg-emerald-600 mx-auto flex items-center justify-center rounded-full shadow">
                <span className="text-white text-lg">↑</span>
              </div>
            </a>
            <span className="text-xs text-emerald-600">HOME</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">1</div>
          <span className="font-semibold text-emerald-700">Guest Info</span>
          <div className="w-8 h-1 bg-emerald-200 mx-2 rounded"></div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-500 font-bold">2</div>
          <span className="font-semibold text-gray-400">Payment</span>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-emerald-100 mb-4">
            <div className="font-bold text-lg px-2 text-emerald-700">GUEST INFORMATION</div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Guest Form */}
            <div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Guest Name *</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Mobile *</label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              {/* Hotel Policy Section */}
              <div className="mt-8">
                <h2 className="font-bold text-lg text-emerald-800 mb-2">
                  Hotel Policy & Booking Conditions
                </h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <span className="uppercase font-bold text-orange-500">Check-In / Check-Out:</span>
                    <span className="block">A valid ID must be presented upon check-in.</span>
                    <span className="block">Check-in time is at 2:00 PM - Check-out is at 12:00 PM.</span>
                  </div>
                  <div>
                    <span className="uppercase font-bold text-orange-500">Food & Beverage:</span>
                    <span className="block">Breakfast: 7:00 a.m. to 10:00 a.m.</span>
                    <span className="block">Pool: 7:00 a.m. to 8:00 p.m.</span>
                    <span className="block">All dinner orders must be confirmed the day prior to booking.</span>
                  </div>
                  <div>
                    <span className="uppercase font-bold text-orange-500">Resort and Sanctuary Visitors:</span>
                    <span className="block">All visitors must be registered ahead of time at the Front Office.</span>
                    <span className="block">The resort may discontinue renting if other guests are disturbed.</span>
                  </div>
                  <div>
                    <h3 className="font-bold mt-4">Cancellation Policy</h3>
                    <ul className="list-disc pl-6">
                      <li>
                        <span className="font-bold">50% Deposit:</span> Required upon booking in advance.
                      </li>
                      <li>
                        <span className="font-bold">Cancellation Fees:</span> 
                        <ul className="list-disc pl-6">
                          <li>Within 48 hours: 5% of the total cost.</li>
                          <li>14+ days before arrival: 15% of the total cost.</li>
                          <li>7 days or less: 75% of the total cost will be retained.</li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-bold">No-Show:</span> Forfeiture of deposit or full payment.
                      </li>
                      <li>
                        <span className="font-bold">Pre-payment Required:</span> 50% deposit or full amount before check-in. Email proof of payment to <a href="mailto:reservations@easynightresort.com" className="underline text-emerald-700">reservations@easynightresort.com</a> and <a href="mailto:info@eazynightsanctuaryresort.com" className="underline text-emerald-700">info@eazynightsanctuaryresort.com</a>.
                      </li>
                      <li>
                        <span className="font-bold">Additional Charges:</span> Any property damage or extra fees incurred.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Checkbox for Terms and Conditions */}
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    className="mr-2 accent-emerald-600 w-5 h-5"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                    I acknowledge and accept the <span className="underline text-emerald-700">Terms of Cancellation Policy & Hotel Policy</span>
                  </label>
                </div>

                <div className="mt-6 text-center">
                  <button
                    className="bg-emerald-600 text-white px-8 py-2 rounded shadow hover:bg-emerald-700 transition font-semibold disabled:opacity-60"
                    onClick={handleBookNow}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Book Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div>
              <div className="bg-emerald-50 p-6 rounded-lg shadow-md">
                <h2 className="text-lg text-center text-emerald-700 font-bold mb-4">
                  Your Booking Summary
                </h2>
                {bookingData ? (
                  <>
                    <div className="mt-4">
                      <h3 className="font-bold text-emerald-800">Easy Stay Resort and Sanctuary</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-amber-400 text-lg">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="flex items-center text-sm mt-2">
                        <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><circle cx={12} cy={10} r={3} /></svg>
                        Kan Jose, Tubigon, Tawala, Panglao, Bohol - 6340, Philippines
                      </p>
                      <p className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v16l-8-4-8 4V5z" /></svg>
                        63902559329
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-b border-emerald-100 py-4 mt-4">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Check In: {bookingData.checkIn}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Check Out: {bookingData.checkOut}
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {totalNights} Night Stay
                      </span>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-bold">Rooms and Rates (Price for {totalNights} Night{totalNights > 1 ? "s" : ""})</h3>
                      <div className="mt-2 text-sm space-y-2">
                        {bookingData.rooms &&
                          bookingData.rooms.map((room, index) => (
                            <div key={index} className="border-b border-emerald-100 pb-2">
                              <p>
                                <span className="font-bold">Room:</span> {room.name} ({room.quantity})
                              </p>
                              <p>
                                <span className="font-bold">Rate Details:</span> ₱{room.price} x {room.quantity}
                              </p>
                              <p>
                                <span className="font-bold">Total Room Charges:</span> ₱{room.price * room.quantity * totalNights}
                              </p>
                            </div>
                          ))}
                        <p>
                          <span className="font-bold">VAT Taxes:</span> 0
                        </p>
                        <p>
                          <span className="font-bold">Total Price (Inc. Of Taxes):</span>{" "}
                          <span className="text-emerald-700 font-bold">₱{calculateTotal()}</span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>
                    No booking data available. Please return to the booking page.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
