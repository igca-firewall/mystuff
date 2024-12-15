"use client";

import { rightBarLinks, sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Footer from "../utilities/Footer";

import { useUserContext } from "@/context/AuthContext";

const RightSidebar = () => {
  const pathname = usePathname();
  const { user } = useUserContext();
  {
    if (!user) {
      return null;
    }
    if (user.role !== "admin") {
      return null;
    }
  }
  return (
    <section className="fixed  custom-scrollbar rightbar h-screen">
      <div className="flex flex-col h-full gap-6 px-4 ">
        {rightBarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname?.startsWith(`${item.route}/`);
          return (
            <Link
              href={item.route}
              key={item.label}
              className={`rightbar_link items-center ${
                isActive ? "bg-purple-500 " : "hover:bg-purple-400"
              }`}
            >
              <div className="relative size-4">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  priority
                  className={`${
                    isActive
                      ? "brightness-[3] invert-white"
                      : "hover:invert-white"
                  }`}
                />
              </div>
              <p className="text-neutral-600 text-sm dark:text-neutral-100 md:hidden max-lg:block xl:block">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      {/* <div className="md:hidden sm:hidden flex xl:block">
        {" "}
        <Link href="/settings">
          <div className="flex items-center p-2 px-8 flex-between gap-1">
            <Image
            src="/icons/settings.svg"
            width={25}
            height={25}
            alt="Settings"
            className="rounded-full text-gray-600 dark:text-gray-300"
          />{" "}
          <p className="text-neutral-500 text-[14px] font-bold dark:text-neutral-400">Settings</p>
      
          </div>
           </Link>{" "}
           
      </div> */}{" "}
  
    </section>
  );
};

export default RightSidebar;
