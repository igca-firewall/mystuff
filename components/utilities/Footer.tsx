"use client"
// import { logoutAccount } from "@/lib/actions/user.actions";
// import { LocalStorageManager } from "@/lib/utils";
// import Image from "next/image";
// import { redirect, useRouter } from "next/navigation";
import React from "react";
import Logout from "./Logout";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  
  return (
    <footer className=" py-3 px-2  ">
      <div className="flex gap-2 ">
        <div>
          <div
            className={type === "mobile" ? "footer_name-mobile" : "footer_name"}
          >
            <p className="text-[15px] font-bold text-gray-700 dark:text-neutral-300">
              {user?
              
            user?.firstName : "First Name"}
             
            </p>
          </div>
        </div>

        <div className=" flex ">
          <div
            className={
              type === "mobile" ? "footer_email-mobile" : "footer_email"
            }
          >
            <h1 className="text-[12px] truncate text-gray-700 dark:text-neutral-300 font-semibold">
             {user?.name} 
            </h1>
            <p className="text-[10px] truncate font-normal dark:text-neutral-300 text-gray-600">
              {user?.phone}
            </p>
            <Logout/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
