"use client";
import StudentForm from "@/components/utilities/StudentsForm";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";

import React from "react";

const Registration = () => {
  const { user } = useUserContext();
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100">
      <div className="w-full h-full">
        {user.role === "admin" ? <StudentForm /> : <Unauthorized />}
      </div>
    </div>
  );
};

export default Registration;
