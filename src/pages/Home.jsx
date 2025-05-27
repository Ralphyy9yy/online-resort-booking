import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Import images
import bgImage from "../assets/bgImage.jpg";
import bg from "../assets/display.jpg";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import display2 from "../assets/display2.jpg";


export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const facilities = [
    { src: image1, label: "Pools", link: "/facilities", description: "Luxurious infinity pools with stunning views" },
    { src: image2, label: "Resto Bar", link: "/facilities", description: "Exquisite dining and premium drinks" },
    { src: image3, label: "Spa & Wellness", link: "/facilities", description: "Rejuvenate your body and mind" },
    { src: image4, label: "Kids Playground", link: "/facilities", description: "Safe and fun environment for children" },
    { src: image5, label: "Fitness Center", link: "/facilities", description: "State-of-the-art equipment for your workout" },
    { src: image6, label: "Fine Dining", link: "/facilities", description: "Culinary excellence with local flavors" },
  ];

  const testimonials = [
    {
      text: "EasyStay made our honeymoon absolutely perfect. The private villas and attentive service exceeded our expectations.",
      author: "Irish ",
      location: "Philippines"
    },
    {
      text: "The most serene and beautiful resort we've ever visited. We'll definitely be coming back next year!",
      author: "Joyce",
      location: "Philippines"
    },
    {
      text: "A hidden gem in Bohol. The botanical gardens and natural integration of the villas are simply stunning.",
      author: "Wayne",
      location: "Philippines"
    }
  ];

  const staggerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const childAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section with Parallax Effect */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0  bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
  transition={{ duration: 1, ease: "easeOut" }}
>
  <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"> {/* Added font-serif */}
    Welcome to <span className="text-yellow-400 ">Donatela</span>
  </h1>
  <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto"> {/* Added font-serif */}
    Experience luxury and tranquility in the heart of Bohol
  </p>
  <motion.div
    className="flex flex-col sm:flex-row gap-4 justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: isLoaded ? 1 : 0 }}
    transition={{ delay: 0.5, duration: 0.8 }}
  >

              <motion.a
                href="/booking"
                className="relative group inline-flex items-center bg-white text-gray-900 font-bold py-4 px-8 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">BOOK NOW</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </motion.a>
              <motion.a
                href="/facilities"
                className="relative group inline-flex items-center bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>EXPLORE FACILITIES</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -10 }}
          transition={{ delay: 1.2, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2">Scroll Down</span>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* About Section with improved layout */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Explore Bohol <br />
                  <span className="text-yellow-600">in Style</span>
                </h2>
                <div className="h-1 w-20 bg-yellow-500 mb-8"></div>
                <p className="text-lg text-gray-700 mb-6">
                  Set overlooking the Bohol Sea, this luxury resort is 3 km from Alona Beach, 4 km from Dumaluan Beach.
                  It is 10 mins away from Bohol-Panglao International Airport.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  EasyStay was built with nature in mind. The eight luxurious villas were created to blend
                  organically into 7.5 hectares of botanical gardens, giving each guest plenty of private space
                  without sacrificing taste and comfort.
                </p>
                <div className="flex gap-4 mt-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-800">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Luxury Villas
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-800">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Beachfront
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-800">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Fine Dining
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <img 
                  src={image1} 
                  alt="Resort View" 
                  className="rounded-lg h-64 w-full object-cover shadow-lg transform -rotate-2"
                />
                <img 
                  src={image3} 
                  alt="Resort Amenities" 
                  className="rounded-lg h-64 w-full object-cover shadow-lg transform rotate-2 translate-y-8"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-12">Resort Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", 
                  title: "Luxury Villas", 
                  desc: "8 spacious villas surrounded by botanical gardens" 
                },
                { 
                  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", 
                  title: "Private Beach", 
                  desc: "Exclusive access to pristine shoreline" 
                },
                { 
                  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", 
                  title: "Wellness Center", 
                  desc: "Spa treatments and wellness activities" 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-8 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="rounded-full bg-yellow-500 p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-lg font-medium">
              <p>EasyStay Resort boasts an outdoor swimming pool and a private beach area.</p>
              <p className="mt-2">At EasyStay, nature is the landlord. We do not disturb. We are only the humble tenant.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full-Width Background Section with Parallax */}
      <motion.div 
        className="relative min-h-[60vh] w-full bg-cover bg-center bg-fixed bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${bg})` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0  bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience Paradise</h2>
          <p className="text-xl mb-8">Where luxury meets natural beauty</p>
          <motion.a
            href="/booking"
            className="inline-flex items-center bg-white text-gray-900 font-bold py-3 px-6 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">CHECK AVAILABILITY</span>
            <span>→</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Facilities Section with Improved Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Our Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the exceptional amenities and services that make EasyStay a truly luxurious destination
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg h-80"
                variants={childAnimation}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
                <img
                  src={facility.src}
                  alt={facility.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-white text-2xl font-bold mb-2">{facility.label}</h3>
                  <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{facility.description}</p>
                  <Link 
                    to={facility.link} 
                    className="inline-flex items-center text-white font-medium"
                  >
                    <span className="mr-2">Learn More</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <motion.a
              href="/facilities"
              className="inline-flex items-center bg-gray-900 text-white font-bold py-3 px-6 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">VIEW ALL FACILITIES</span>
              <span>→</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from guests who have experienced the EasyStay difference
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute -top-5 left-8 text-yellow-500 text-6xl">"</div>
                <p className="text-gray-600 mb-6 relative z-10">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div
        className="relative min-h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${display2})` }}
      >
        <div className="absolute inset-0  bg-opacity-50"></div>
        <motion.div 
          className="relative z-10 text-white max-w-4xl text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-sm md:text-base uppercase tracking-widest mb-2">Visit Bohol in Style</h3>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Celebrate your <br /> Special Occasion
          </h2>
          <motion.a
            href="/booking"
            className="inline-flex items-center bg-white text-gray-900 font-bold py-4 px-10 rounded-lg group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">BOOK NOW</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </motion.a>
        </motion.div>
      </div>

     

    </div>
  );
}