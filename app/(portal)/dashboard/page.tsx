"use client"
import Dashboard from "@/components/Dashboard";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import React from "react";

const page = () => {
  const { user } = useUserContext();
  return <div>{user.role === "admin" ? <Dashboard /> : <Unauthorized />}</div>;
};

export default page;
