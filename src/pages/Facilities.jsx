import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import facilities from "../assets/facilities.jpg";
import pool from "../assets/pool.jpg";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.jpg";
import image3 from "../assets/image3.jpg";
import function1 from "../assets/function1.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import display2 from "../assets/display2.jpg";

const Facility = ({ image, title, features, isReversed }) => {
  return (
    <motion.div 
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between px-6 md:px-20 py-16 gap-12`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Image */}
      <div className="w-full md:w-1/2">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2 text-gray-800">
        <motion.div
          initial={{ opacity: 0, x: isReversed ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-500">
              {title}
            </span>
            <span className="block h-1 w-20 bg-gradient-to-r from-gray-700 to-gray-400 mt-2"></span>
          </h2>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Facilities = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const facilitiesData = [
    {
      title: "POOLS",
      image: pool,
      features: [
        "Main Pool, Kiddie Pool, Infinity Pool",
        "Jacuzzi or hot tubs for relaxation",
        "Pool towels and complimentary water stations",
        "Nighttime lighting for evening swims",
        "Poolside cabanas and lounge chairs",
        "Music and live DJ performances at certain times"
      ]
    },
    {
      title: "RESTO BAR",
      image: image2,
      features: [
        "Indoor and outdoor dining options",
        "Fully stocked bar with alcoholic and non-alcoholic beverages",
        "Offers finger foods, bar snacks, and tapas",
        "Live music, DJs, or karaoke nights",
        "Happy hour promotions and drink specials",
        "Lounges areas for relaxed socializing"
      ]
    },
    {
      title: "KIDS PLAYGROUND",
      image: image4,
      features: [
        "Play Equipments",
        "Soft, cushioned flooring",
        "Fencing and secure entry/exit points",
        "Benches for parents and guardians",
        "Restrooms and water stations nearby",
        "Toddler-friendly zones with age-appropriate equipment",
        "Inclusive play structures for children with disabilities"
      ]
    },
    {
      title: "SPA & WELLNESS CENTER",
      image: image3,
      features: [
        "Massages",
        "Body Treatments",
        "Beauty Services",
        "Sauna and Steam Rooms",
        "Yoga and Meditation Classes",
        "Stress Relief and Sleep Therapy",
        "Aromatherapy and Herbal Baths"
      ]
    },
    {
      title: "FUNCTION HALL",
      image: function1,
      features: [
        "Spacious hall with flexible seating arrangements",
        "High ceilings and elegant décor",
        "Adjustable lighting to suit the event's ambiance",
        "Air-conditioning or climate control systems",
        "Projectors, screens, and audio systems",
        "On-site catering with customizable menu options",
        "Event coordinator or concierge for planning and execution"
      ]
    },
    {
      title: "FITNESS CENTER",
      image: image5,
      features: [
        "Exercise Equipment",
        "Yoga and Stretching Zone",
        "Aerobics or Dance Studio",
        "Towels and complimentary toiletries",
        "Locker rooms with secure storage and shower facilities",
        "Sound systems and TV screens for entertainment while working out",
        "Health bar or juice lounge for post-workout refreshments"
      ]
    },
    {
      title: "FINE DINING",
      image: image6,
      features: [
        "Elegant décor with premium furnishings",
        "Intimate lighting and stylish table settings",
        "Scenic views (e.g., beachfront, garden, or cityscape)",
        "Live instrumental music or soft background tune",
        "Multi-course meals with exquisite presentation",
        "Extensive wine list, including premium wines and champagnes",
        "Specialty cuisine options"
      ]
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative min-h-[80vh] bg-cover bg-center flex items-center justify-center md:justify-start px-6 md:px-20"
        style={{ backgroundImage: `url(${facilities})` }}
      >
        <div className="absolute inset-0  bg-opacity-40"></div>
        <div className="relative z-10 text-white w-full max-w-xl md:ml-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h3 className="font-light text-xl mb-2 tracking-wider">EasyStay</h3>
            <h2 className="text-5xl sm:text-7xl font-bold mb-6">Facilities</h2>
            <p className="text-lg mb-8 max-w-md opacity-90">
              Experience luxury and comfort with our world-class amenities designed to make your stay unforgettable.
            </p>
            <motion.a
              href="/booking"
              className="inline-flex items-center bg-white text-gray-800 font-bold py-4 px-8 rounded-lg group hover:bg-gray-800 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">BOOK NOW</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto text-center py-16 px-6">
        <motion.h2 
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          World-Class Amenities
        </motion.h2>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          At EasyStay, we pride ourselves on offering a comprehensive range of facilities designed to enhance your stay.
          From relaxation to entertainment, we have everything you need for a perfect getaway.
        </motion.p>
      </div>

      {/* Facilities List */}
      <div className="py-8">
        {facilitiesData.map((facility, index) => (
          <Facility
            key={index}
            image={facility.image}
            title={facility.title}
            features={facility.features}
            isReversed={index % 2 !== 0}
          />
        ))}
      </div>

      {/* Call to Action */}
      <div
        className="relative min-h-[70vh] bg-cover bg-center flex items-center justify-center px-6 py-20"
        style={{ backgroundImage: `url(${display2})` }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
        <motion.div 
          className="relative z-10 text-white max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-sm md:text-base uppercase tracking-widest mb-2">Visit Bohol in Style</h3>
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            Celebrate your <br /> Special Occasion
          </h1>
          <motion.a
            href="/booking"
            className="inline-flex items-center bg-white text-gray-800 font-bold py-4 px-10 rounded-lg group hover:bg-gray-800 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">BOOK NOW</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-gray-500 uppercase tracking-widest mb-2">What Our Guests Say</h3>
            <h2 className="text-3xl font-bold">Guest Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The infinity pool was breathtaking, and the spa treatments were exactly what I needed to unwind. Highly recommend!",
                author: "Sarah T.",
                location: "New York, USA"
              },
              {
                text: "We held our company retreat in the function hall and everything was perfect. The staff was attentive and the facilities were top-notch.",
                author: "Michael R.",
                location: "Singapore"
              },
              {
                text: "The kids playground kept our children entertained while we enjoyed the resto bar. Perfect balance for a family vacation!",
                author: "Emma L.",
                location: "Sydney, Australia"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Are all facilities included in the room rate?",
                answer: "Basic facilities like the pools, fitness center, and kids playground are included. Spa services, function hall rentals, and fine dining experiences may have additional costs."
              },
              {
                question: "What are the operating hours for the pool and fitness center?",
                answer: "The pools are open from 7 AM to 10 PM daily. The fitness center is available 24/7 for hotel guests."
              },
              {
                question: "Can non-hotel guests access the facilities?",
                answer: "Some facilities are exclusive to hotel guests, while others offer day passes for visitors. Please contact our reception for more information."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;