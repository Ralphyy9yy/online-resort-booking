import React, { useEffect } from "react";

const InfoHotel = ({ isOpen, onClose }) => {
  // Close modal on ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 pt-14 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-3xl font-bold mb-6 text-green-800">Hotel Info</h2>

        {/* Hotel Information */}
        <section className="border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-serif font-semibold flex items-center mb-2">
            Hotel Information
            <span className="ml-3 text-yellow-500 text-xl font-bold tracking-widest">
              ★★★★★
            </span>
          </h1>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Donatela Resort and Sanctuary
          </p>
          <address className="not-italic mb-2 text-gray-700">
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            Km. 16 Hoyohoy, Tawala, Panglao, Bohol - 6340, Philippines
          </address>
          <div className="text-gray-700">
            <span className="font-semibold">Phone:</span>{" "}
            <a
              href="tel:+639105593429"
              className="text-red-600 hover:underline"
              aria-label="Call Donatela Resort"
            >
              +639105593429
            </a>
            <span className="font-semibold ml-4">Email:</span>{" "}
            <a
              href="mailto:reservations@easystayresort.com"
              className="text-red-600 hover:underline"
              aria-label="Email Donatela Resort"
            >
              reservations@easystayresort.com
            </a>
            <span className="font-semibold ml-4">Hotel Type:</span>{" "}
            <span className="text-gray-900">Resorts</span>
          </div>
        </section>

        {/* Check-in/out and Landmarks */}
        <section className="grid md:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="mb-4">
              <span className="text-red-600 font-semibold">Check-In Time</span>
              <div className="ml-2 text-gray-800">02:00 PM</div>
            </div>
            <div className="mb-4">
              <span className="text-red-600 font-semibold">Check-Out Time</span>
              <div className="ml-2 text-gray-800">12:00 PM</div>
            </div>
            <div>
              <span className="text-red-600 font-semibold">
                Important Landmarks Nearby
              </span>
              <ul className="ml-4 mt-2 text-gray-700 list-disc text-sm space-y-1">
                <li>Bohol Panglao International Airport - 15 mins. drive</li>
                <li>Panglao San Agustin Church - 20 mins. drive</li>
                <li>Alona White Beach - 9 mins. drive</li>
                <li>Dumaluan Beach - 11 mins. drive</li>
                <li>Balicasag Island - 30 mins. drive</li>
                <li>Tagbilaran City and Seaport - 30 mins. drive</li>
                <li>City Hospitals and Clinics - 15-30 mins. drive</li>
                <li>Chocolate Hills - 1 hour 45 mins. drive</li>
              </ul>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <span className="text-red-600 font-semibold">Facilities</span>
            <ul className="ml-4 mt-2 text-gray-700 list-disc text-sm space-y-1">
              <li>Swimming Pool</li>
              <li>Resto Bar</li>
              <li>Kids Playground</li>
              <li>Spa and Wellness Center</li>
              <li>Function Hall</li>
              <li>Fitness Center</li>
              <li>Fine Dining</li>
            </ul>
          </div>
        </section>

        {/* Children & Extra Guest Details */}
        <section className="mb-6">
          <span className="text-red-600 font-semibold">
            Children &amp; Extra Guest Details
          </span>
          <ul className="ml-4 mt-2 text-gray-700 list-disc text-sm space-y-1">
            <li>
              Up to two children under 5 years old and below stay free of charge
              when using existing beds.
            </li>
            <li>
              All further older children are charged PHP 1800 per night for extra
              beds and breakfast.
            </li>
            <li>
              Extra adult shall be charged 2,800 per night with extra bed and
              breakfast.
            </li>
            <li>The maximum number of extra beds in a room is 1.</li>
            <li>
              Any type of extra bed or child's cot/crib is upon request and needs
              to be confirmed by management.
            </li>
            <li>
              Supplements are not calculated automatically in the total costs and
              will have to be paid for separately during your stay.
            </li>
          </ul>
        </section>

        {/* Parking Policy */}
        <section className="mb-8">
          <span className="text-red-600 font-semibold">Parking Policy</span>
          <div className="ml-4 mt-2 text-gray-700 text-sm">
            Parking space is available.
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoHotel;
