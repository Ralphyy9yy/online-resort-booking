import React, { useState } from "react";
import { motion } from "framer-motion";
import display2 from "../assets/display2.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // To handle form errors
  const [successMessage, setSuccessMessage] = useState(""); // To show success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");
  
    // Frontend validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all fields.');
      setIsSubmitting(false);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
  
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters long.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Updated endpoint to match your backend route
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        setSuccessMessage('Message sent successfully!');
        setFormData({ name: "", email: "", message: "" }); // clear form
      } else {
        setError(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while submitting your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="w-full">
      {/* Hero Section with Background Image */}
      <div
        className="relative min-h-[80vh] bg-cover bg-center flex flex-col md:flex-row items-center justify-center md:justify-start px-6 md:px-20"
        style={{ backgroundImage: `url(${display2})` }}
        aria-label="Bohol resort promotional banner"
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-screen-lg text-center md:text-left"
        >
          <h3 className="text-xs md:text-sm uppercase tracking-widest font-light">
            Visit Bohol in Style
          </h3>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 leading-tight">
            Celebrate your <br className="hidden md:block" /> Special Occasion
          </h1>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          href="/booking"
          className="relative group bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-5 px-8 md:px-10 mt-8 md:mt-0 md:absolute md:right-20 md:bottom-20 rounded-lg overflow-hidden transition-all duration-300 ease-in-out shadow-lg"
          aria-label="Book your stay now"
        >
          <span className="inline-block transform group-hover:-translate-x-2 transition-transform duration-300">
            BOOK NOW
          </span>
          <span className="absolute opacity-0 group-hover:opacity-100 right-5 transform group-hover:translate-x-2 transition-all duration-300 ease-in-out">
            →
          </span>
        </motion.a>
      </div>

      {/* Contact Information Section */}
      <div className="bg-gray-100 text-gray-800 py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Side: Contact Info + Google Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href="tel:+639105593429" className="text-lg hover:text-green-600 transition-colors">+63 910 559 3429</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg">Km. 16 Hoyohoy, Tawala, Panglao, Bohol - 6340, Philippines</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:reservations@donatelaresort.com" className="text-lg hover:text-green-600 transition-colors">reservations@donatelaresort.com</a>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  title="Donatela Resort and Sanctuary location"
                  className="w-full h-64 md:h-80"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31476.06168823183!2d123.76173051258084!3d9.551427599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33abacb1f25ab8c9%3A0x34500046dc8e7cb!2sDonatela%20Resort%20and%20Sanctuary!5e0!3m2!1sen!2sph!4v1743680200959!5m2!1sen!2sph"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>

            {/* Right Side: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white text-gray-800 p-8 rounded-lg shadow-lg border border-gray-200"
            >
              <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>

              {/* Display Error or Success Messages */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="5"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-md font-semibold transition-all flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1a10 10 0 00-10 10h2z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;