"use client";
import { bottombarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const Bottombar = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-0 z-[70px] md:hidden  xl:hidden flex justify-between w-full sticky rounded-t-2xl bg-neutral-200 dark:bg-neutral-800 px-2 shadow-lg">
      <ul className="flex justify-around w-full">
        {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label} className="flex flex-1 justify-center">
              <Link href={link.route}>
                <div
                  className={`flex flex-col items-center justify-center gap-1 p-2 transition-all ${
                    isActive  ? "text-orange-500" : "text-gray-400"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Image
                    src={link.imgURL}
                    alt=""
                    className={`transition-transform z-[70px] duration-300 ${
                      isActive ? "scale-110" : "brightness-0 dark:invert-white hover:scale-110 hover:brightness-100"
                    }`}
                    width={20}
                    height={20}
                  />
                  <span className="text-sm">{link.label}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Bottombar;
