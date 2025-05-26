import { useState } from "react";
import { motion } from "framer-motion";
 // Updated import path
import frame2 from "../../assets/juniorLogo.png";  // Updated import path
import { FaHome, FaBed } from "react-icons/fa";
import features from "../../assets/features.png";  // Updated import path
import junior1 from "../../assets/JuniorSuite/junior1.jpg";  // Updated import path
import junior2 from "../../assets/JuniorSuite/junior2.jpg";  // Updated import path
import junior3 from "../../assets/JuniorSuite/junior3.jpg";  // Updated import path
import junior4 from "../../assets/JuniorSuite/junior4.jpg";  // Updated import path
import junior5 from "../../assets/JuniorSuite/junior5.jpg";  // Updated import path
import junior6 from "../../assets/JuniorSuite/junior6.jpg";  // Updated import path



import display2 from "../../assets/display2.jpg";  // Updated import path
import junior from "../../assets/junior.jpg";  // Updated import path

export default function Home() {
  const images = [junior1, junior2, junior3, junior4, junior5, junior6];

  // Lightbox state
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open Lightbox
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  // Next Image
  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Previous Image
  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative min-h-[70vh] bg-cover bg-center flex flex-col md:flex-row items-center justify-center md:justify-start px-6 md:px-20"
        style={{ backgroundImage: `url(${junior})` }}
      >
        {/* Image Animation */}
        <motion.img
          src={frame2}
          alt="Standard Room"
          className="relative z-10 w-[80%] md:max-w-[40%]"
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Book Now Button */}
        <a
          href="/booking"
          className="relative group bg-[#704214] text-white text-xl font-bold py-3 px-8 md:px-12 mt-6 md:mt-0 md:absolute md:right-10 md:bottom-10 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
        >
          <span className="inline-block transform group-hover:-translate-x-2 transition-transform duration-300">
            BOOK NOW
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 right-4 transform group-hover:translate-x-2 transition-all duration-300 ease-in-out">
            →
          </span>
        </a>
      </div>

      {/* Feature Details */}
      <motion.div
        className="absolute bottom-65 left-5 md:left-20 text-black flex flex-col gap-4 p-4 rounded-lg backdrop-blur-sm bg-white bg-opacity-10 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
   

      
      </motion.div>

      {/* Features Section */}
      <div className="flex flex-col md:flex-row items-center justify-center bg-white p-6 md:p-12 w-full space-y-8 md:space-y-0">
        <div className="md:w-1/2 flex justify-center">
          <img src={features} alt="Features" className="w-[90%] md:w-[500px] h-auto" />
        </div>
        <div className="md:w-1/2 max-w-lg text-center md:text-left px-4">
          <h2 className="text-2xl font-semibold mb-2">Facilities & Amenities</h2>
          <ul className="list-disc pl-6 md:pl-9">
            <li>Bed Type: one double</li>
            <li>Balcony with 1 table, 2chairs</li>
            <li>Air-condition individually controlled</li>
            <li>Kettle</li>
            <li>Mini Fridge <strong></strong>(Mini Bar on request with extra charge)</li>
            <li>Safe deposit box laptop size</li>
            <li>Tea & Coffee making facilities</li>
            <li>Drinking water in the bathroom</li>
            <li>Iron - ironing board (on request)</li>
            <li>Beach towels, slippers & bathrobes</li>
            <li>Cleaning: 7 times per week</li>
            <li>Bed linen Change: 3 times per week</li>
          </ul>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative group cursor-pointer" onClick={() => openLightbox(index)}>
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-80 rounded-lg shadow-md transform group-hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button onClick={closeLightbox} className="absolute top-5 right-10 text-white text-4xl">✖</button>
          <button onClick={prevImage} className="absolute left-5 text-white text-4xl">❮</button>
          <img src={selectedImage} alt="Large View" className="max-w-full max-h-[80vh] rounded-lg shadow-lg" />
          <button onClick={nextImage} className="absolute right-5 text-white text-4xl">❯</button>
        </div>
      )}
   
    <div
        className="relative min-h-[70vh] bg-cover bg-center flex flex-col md:flex-row items-center justify-center md:justify-start px-6 md:px-20"
        style={{ backgroundImage: `url(${display2})` }}
      >
        <div className="relative z-10 text-white max-w-screen-lg text-center md:text-left">
          <h3 className="text-xs md:text-sm uppercase tracking-widest">
            Visit Bohol in Style
          </h3>
          <h1 className="text-3xl md:text-6xl font-bold mt-2">
            Celebrate your <br /> Special Occasion
          </h1>
        </div>
        <a
          href="/booking"
          className="relative group bg-[#704214] text-white text-xl font-bold py-5 px-8 md:px-10 mt-6 md:mt-0 md:absolute md:right-50 md:bottom-65 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
        >
          <span className="inline-block transform group-hover:-translate-x-2 transition-transform duration-300">
            BOOK NOW
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 right-5 transform group-hover:translate-x-2 transition-all duration-300 ease-in-out">
            →
          </span>
        </a>
      </div>
      
    </div>
    
  );
}
