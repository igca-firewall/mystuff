import Image from 'next/image';

export default function ProfileCard({ name, className, age }:{name:string, age:number, className: string}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl dark:bg-neutral-800 h-full w-96 p-6 flex flex-col items-center transition-transform transform hover:scale-105">
      {/* Profile Image */}
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-md">
        <Image 
          src="/images/th.jpg" 
          alt="student" 
          className="object-cover" 
          width={112} 
          height={112} 
        />
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-5">
        {name}
      </h2>

      {/* Class and Age */}
      <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
        {className} <span className="mx-2 text-gray-500 dark:text-gray-600">&#8226;</span> {age} years old
      </p>

      {/* Action Button */}
      <button className="mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700">
        View Results
      </button>
    </div>
  );
}
