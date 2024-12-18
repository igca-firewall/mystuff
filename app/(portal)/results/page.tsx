"use client"
import ResultPage from '@/components/utilities/StudentResult'
import SubjectResultUploader from '@/components/utilities/View'
import React from 'react'
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";

import ScratchCardOTP from "@/components/utilities/GetCard"
const AllResults = () => {

  const { user } = useUserContext();
  return <div>{user.role !== "admin" ? <SubjectResultUploader/>: <ScratchCardOTP/>}</div>;
};

export default AllResults