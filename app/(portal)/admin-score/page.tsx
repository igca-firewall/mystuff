"use client"
import React from "react";
import InputForm from "@/components/utilities/ScoreSheet";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
const AddScore = () => {
  const { user } = useUserContext();
  return <div>{user.role === "admin" ? <InputForm /> : <Unauthorized />}</div>;
};

export default AddScore;
