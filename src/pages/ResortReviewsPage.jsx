import { useState } from 'react';
import { Link } from "react-router-dom";
export default function ResortReviewsPage() {
  const [helpful, setHelpful] = useState(null);
  
  const handleHelpful = (value) => {
    setHelpful(value);
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
        <Link to="/" className="text-white hover:text-gray-300">
          
            EasyStay
            </Link>
            </h1>
        <div className="flex items-center">
          <span className="mr-2">
           <Link to="/" className="text-white hover:text-gray-300">
            Home
            </Link>
          
            </span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
      </header>
      
      {/* Resort Information */}
      <div className="bg-green-700 text-white p-8 pb-12">
        <div className="max-w-6xl mx-auto flex justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-2">
                
                EasyStay Resort
                </h2>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Km. 16 Hoyohoy, Tawala, Panglao, Bohol - 6340, Philippines.</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+639175266001</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>reservations@donatelaresort.com</span>
              </div>
            </div>
          </div>
          
          {/* Rating Box */}
          <div className="bg-white text-gray-800 rounded p-6 w-64 text-center">
            <h2 className="text-5xl font-bold text-green-700">4.93</h2>
            <div className="flex justify-center my-2">
              {[1, 2, 3, 4].map(star => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath="url(#clip-half)" />
                <defs>
                  <clipPath id="clip-half">
                    <rect x="0" y="0" width="10" height="20" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="text-gray-600">Out of 5</p>
            <p className="mt-2 text-sm">Guest Reviews Based on 2 Reviews</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 -mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Score Breakdown */}
          <div className="md:w-1/3 bg-white border border-gray-200 rounded-md p-4">
            <h3 className="text-xl text-green-700 font-medium mb-4">Score breakdown</h3>
            
            {/* Score Items */}
            {[
              { name: "Value", score: 5.0 },
              { name: "Staff service", score: 5.0 },
              { name: "Rooms", score: 5.0 },
              { name: "Location", score: 5.0 },
              { name: "Friendliness", score: 5.0 },
              { name: "Cleanliness", score: 5.0 },
              { name: "Breakfast", score: 4.5 }
            ].map((item, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span>{item.score.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div 
                    className="bg-green-700 h-2 rounded-full" 
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Reviews Section */}
          <div className="md:w-2/3">
            <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-600">Show reviews from:</label>
                  <select className="w-full border border-gray-300 rounded p-2 mt-1">
                    <option>All Reviewers</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-600">Sort by:</label>
                  <select className="w-full border border-gray-300 rounded p-2 mt-1">
                    <option>Date (Newer to Older)</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-600">Stay:</label>
                  <select className="w-full border border-gray-300 rounded p-2 mt-1">
                    <option>Select</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-600">Room:</label>
                  <select className="w-full border border-gray-300 rounded p-2 mt-1">
                    <option>Select</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Review Card */}
            <div className="bg-white border border-gray-200 rounded-md">
              <div className="flex flex-col md:flex-row">
                {/* Left Side - User Info */}
                <div className="md:w-1/4 border-r border-gray-200 p-4 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <img 
                      src="/api/placeholder/80/80"
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-lg">Noel Reyes</h4>
                  <p className="text-sm text-gray-600 mb-1">Family</p>
                  <p className="text-xs text-gray-500">(Antipolo, Philippines)</p>
                  
                  <p className="text-sm mt-4">Apr 09, 2019</p>
                  <p className="text-xs text-gray-500 mt-4">
                    2 person found this review helpful.
                  </p>
                  
                  <div className="mt-4">
                    <img 
                      src="/api/placeholder/50/50"
                      alt="Person"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Right Side - Review Content */}
                <div className="md:w-3/4 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium text-green-700">"Bali Feels by Reyes Family"</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">4.9</span>
                      <svg className="w-6 h-6 ml-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">Family</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">Pool Villa</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Stayed 3 nights</span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">
                    We liked very much the serenity of the Resort. The food in Paprika was delicious. The staff service too was excellent. Kudos to Nica, Flor, Bhadz, Jean, Jovy, Henry and the shuttle drivers. We were already happy with the garden villa and the... 
                    <span className="text-blue-500 cursor-pointer"> + More..</span>
                  </p>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-start mb-4">
                      <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <p className="text-gray-700">
                        Mostly everything. The villas have a feel of Bali. The space was great. And the interior designs were tastefully chosen. The Gun Bar ambiance also had a premium feel and had a good selection of wine and liquor.
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-amber-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                      <p className="text-gray-700">
                        Not a dislike but a suggestion. The pool villa needs an outdoor footwash. Also, my wife wanted to buy the abaca bag but was not for sale. Maybe set up a gift shop for some of your room items.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center">
                    <p className="mr-4 text-gray-600">Was this review helpful?</p>
                    <button 
                      className={`flex items-center mr-2 px-3 py-1 rounded ${helpful === 'yes' ? 'bg-green-100' : 'bg-gray-100'}`}
                      onClick={() => handleHelpful('yes')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      Yes
                    </button>
                    <button 
                      className={`flex items-center px-3 py-1 rounded ${helpful === 'no' ? 'bg-red-100' : 'bg-gray-100'}`}
                      onClick={() => handleHelpful('no')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                      </svg>
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}