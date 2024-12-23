"use client";
import StudentForm from "@/components/utilities/StudentsForm";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";

import React from "react";

const Registration = () => {
  const { user } = useUserContext();
  if (!user) {
    // Show loader and loading message if user is not yet known
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white">
        <div className="animate-spin rounded-full border-t-4 border-purple-600 w-16 h-16 mb-4"></div>
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          Loading, please wait...
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100">
      <div className="w-full h-full">
        {!user ? <div>Loading</div> :user.role === "admin" ? <StudentForm /> : <Unauthorized />}
      </div>
    </div>
  );
};

export default Registration;
