"use client"
// import { logoutAccount } from "@/lib/actions/user.actions";
// import { LocalStorageManager } from "@/lib/utils";
// import Image from "next/image";
// import { redirect, useRouter } from "next/navigation";
import React from "react";
import Logout from "./Logout";
import Image from "next/image";
import Link from "next/link";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  
  return (
    <footer className=" py-3 px-2  ">
      <div className="flex gap-2 ">
        <div>
        <Link href="/personalization">
              <div className="flex items-center">
                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <Image
                    src={user.image }
                    alt="User Image"
                    width={38}
                    height={38}
                    className="w-8 h-8 rounded-full object-cover"
                    layout="responsive"
                    quality={100}
                  />
                </div>
              </div>
            </Link>
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
