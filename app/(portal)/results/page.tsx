"use client"
import ResultPage from '@/components/utilities/StudentResult'
import SubjectResultUploader from '@/components/utilities/View'
import React from 'react'
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";

import ScratchCardOTP from "@/components/utilities/GetCard"
const AllResults = () => {

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
  return     <div className="justify-center items-center w-full h-full">{!user ? <div>Loading</div> : user.role === "admin" ? <SubjectResultUploader/>: <ScratchCardOTP/>}</div>;
};

export default AllResults