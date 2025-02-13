"use client"
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { compileResult } from "@/lib/actions/rexults.actions";
import React from "react";

const page = () => {
  const handleCompile =  async()=>{
    const contest = await compileResult()
    console.log(contest)
  }
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
  return     <div className="justify-center items-center w-full h-full">{user.role === "admin" ? <div> <Dashboard />  <Button className="py-12 px-12 bg-purple-500 rounded-full " onClick={() => handleCompile()}>
        Compile  Results
      </Button></div> :(
    <Unauthorized />   )}
  </div>;
};

export default page;
