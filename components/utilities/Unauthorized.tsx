import React from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaHome } from 'react-icons/fa';

const Unauthorized = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="max-h-screen flex flex-col items-center justify-center bg-white  text-white px-6">
      {/* SEO Optimization */}
    
      {/* Lock Icon */}
      <div className="bg-gray-700 p-6 rounded-full shadow-lg mb-8">
        <FaLock className="text-gray-300 text-5xl" />
      </div>

      {/* Error Message */}
      <h1 className="text-4xl font-extrabold mb-4 text-center text-neutral-950 tracking-tight">
        Access Denied
      </h1>
      <p className="text-center text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
        Sorry, you don’t have permission to view this page. If you think this is an error, please contact your administrator for assistance.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleGoHome}
          className="flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-700 transition focus:outline-none focus:ring focus:ring-gray-600"
        >
          <FaHome className="mr-2" /> Go to Home
        </button>

        <button
          onClick={() => router.push('/docs')}
          className="flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-500 transition focus:outline-none focus:ring focus:ring-red-500"
        >
          Contact Support
        </button>
      </div>

      {/* Decorative Element */}
  
    </div>
  );
};

export default Unauthorized;
