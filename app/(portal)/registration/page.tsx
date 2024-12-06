"use client";
import StudentForm from "@/components/utilities/StudentsForm";
import React from "react";

const Registration = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100">
      <div className="w-full h-full">
        <StudentForm />
      </div>
    </div>
  );
};

export default Registration;
