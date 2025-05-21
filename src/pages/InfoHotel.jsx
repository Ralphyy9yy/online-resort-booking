import React from "react";
import { Link } from "react-router-dom";

const InfoHotel = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-[#f2f2f2] rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-500 mb-2 tracking-wide uppercase">Hotel Info</h2>
        <div className="border-b border-gray-300 pb-3 mb-6">
          <h1 className="text-3xl font-bold mb-1 flex items-center">
            <span className="font-serif text-black">Hotel Information</span>
            <span className="ml-3 text-yellow-500 text-lg font-bold tracking-widest">★★★★★</span>
          </h1>
          <div className="text-xl font-semibold text-gray-800 mb-2">
            Donatela Resort and Sanctuary
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            Km. 16 Hoyohoy, Tawala, Panglao, Bohol - 6340, Philippines
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Phone:</span>{" "}
            <a href="tel:+639105593429" className="text-red-600 hover:underline">+639105593429</a>
            {"  "}
            <span className="font-semibold text-gray-700 ml-4">Email:</span>{" "}
            <a href="mailto:reservations@easystayresort.com" className="text-red-600 hover:underline">reservations@easystayresort.com</a>
            {"  "}
            <span className="font-semibold text-gray-700 ml-4">Hotel Type:</span>{" "}
            <span className="text-gray-900">Resorts</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="mb-2">
              <span className="text-red-600 font-semibold">Check-In Time</span>
              <div className="ml-2 text-gray-800">02:00 PM</div>
            </div>
            <div className="mb-2">
              <span className="text-red-600 font-semibold">Check-Out Time</span>
              <div className="ml-2 text-gray-800">12:00 PM</div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 font-semibold">Important Landmarks Nearby</span>
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
        </div>

        <div className="mb-6">
          <span className="text-red-600 font-semibold">Children &amp; Extra Guest Details</span>
          <ul className="ml-4 mt-2 text-gray-700 list-disc text-sm space-y-1">
            <li>Up to two children under 5 years old and below stay free of charge when using existing beds.</li>
            <li>All further older children are charged PHP 1800 per night for extra beds and breakfast.</li>
            <li>Extra adult shall be charged 2,800 per night with extra bed and breakfast.</li>
            <li>The maximum number of extra beds in a room is 1.</li>
            <li>Any type of extra bed or child's cot/crib is upon request and needs to be confirmed by management.</li>
            <li>Supplements are not calculated automatically in the total costs and will have to be paid for separately during your stay.</li>
          </ul>
        </div>

        <div className="mb-8">
          <span className="text-red-600 font-semibold">Parking Policy</span>
          <div className="ml-4 mt-2 text-gray-700 text-sm">
            Parking space is available.
          </div>
        </div>

        <Link
          to="/booking"
          className="inline-block px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition font-semibold"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default InfoHotel;
