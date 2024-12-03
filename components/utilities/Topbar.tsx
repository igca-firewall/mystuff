"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";
// import { decryptKey } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkItem {
  route: string;
  label: string;
  imgURL: string;
  hasNotification?: boolean; // New property to indicate notification
}

interface xee {
  links: LinkItem[];
 
}

const Topbar: React.FC<xee> = ({ links}) => {
  const [isVisible, setIsVisible] = useState(true);
   let lastScrollTop = 0;

  // const router = useRouter(); // Use router to programmatically navigate
   const { user } = useUserContext();
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const userInformation = await getUserInfo();
  //     if (userInformation) (userInformation);
  //   };
  //   fetchUserInfo();
  // }, []);

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     const name = await getUserName();
  //     if (name) setUserName(name);
  //   };
  //   fetchUserName();
  // }, []);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop <= lastScrollTop);
      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check for notifications and update count
  // useEffect(() => {
  //   const count = links.filter((link) => link.hasNotification).length;
  //   setNotificationCount(count); // Update notification count

  //   if (count > 0) {
  //     setShowNotification(true); // Show notification if there are any

  //     // Start the timer to hide the notification after 6 seconds
  //     const notificationTimeout = setTimeout(() => {
  //       setShowNotification(false);
  //     }, 6000);

  //     // Clear timeout when the component unmounts or notifications change
  //     return () => clearTimeout(notificationTimeout);
  //   } else {
  //     setShowNotification(false); // Hide notification if no notifications
  //   }
  // }, [links]); // Re-run this effect when `links` change

  // Handle click on the notification indicator
  // const handleNotificationClick = () => {
  //   const firstNotificationLink = links.find((link) => link.hasNotification);
  //   if (firstNotificationLink) {
  //     router.push(firstNotificationLink.route); // Navigate to the first notification route
  //   }
  // };
  console.log(user, "user");
  const userImage = user.image
  return (
    <>
      {/* Notification Banner */}

      <div
        className={`fixed xl:hidden md:hidden top-0 left-0 right-0 h-auto bg-neutral-200 dark:bg-neutral-800 shadow-md z-50 transition-transform duration-300 ${
          isVisible ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-between px-4 py-2">
          {/* Top Row: Hamburger menu and profile */}
          <div className="flex justify-between items-center w-full">
            <Link href="/menu" className="w-6 h-6 overflow-hidden">
              <Image
                alt="Menu"
                src="/icons/hamburger.svg"
                width={30}
                height={30}
                layout="responsive"
                quality={100}
                className="dark:invert"
              />
            </Link>
            <div className="w-[180px] h-full max-h-20 md:hidden max-lg:block xl:block justify-center">
              <Image
                src="/images/particles.png"
                alt=""
                width={20}
                height={3}
                className="dark:invert-white w-[100px] h-[70px]"
                layout="responsive"
                quality={90}
              />
            </div>
            <Link href="/personalization">
              {userImage ? (
                <div className="flex items-center">
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <Image
                      src={user.image}
                      alt="User Image"
                      width={38}
                      height={38}
                      className="w-8 h-8 rounded-full object-cover"
                      layout="responsive"
                      quality={100}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <Image
                      src="/images/th.jpg"
                      alt="User Image"
                      width={38}
                      height={38}
                      className="w-8 h-8 rounded-full object-cover"
                      layout="responsive"
                      quality={100}
                    />
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Bordered Input Section */}
          <div className="w-full mt-2">
            <div className="border-2 border-gray-300 dark:border-gray-950 h-10 rounded-[10px] flex items-center justify-between px-2">
              {links.map((item) => {
                const isActive =
                  pathname === item.route || pathname?.startsWith(item.route);

                return (
                  <Link href={item.route} key={item.label} className="relative">
                    <div
                      className={`flex items-center justify-center ${
                        isActive ? "text-orange-500" : ""
                      }`}
                    >
                      <div className="relative w-12 h-12 flex items-center justify-center group">
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          height={20}
                          width={20}
                          className={`transition-transform duration-1000 ease-in-out ${
                            isActive
                              ? "brightness-100"
                              : "hover:scale-110 brightness-0 dark:invert-white hover:brightness-75"
                          }`}
                        />
                        <span
                          className={`absolute hidden top-1/2 z-30 left-full transform -translate-y-1/2 ml-2 opacity-100 group-hover:opacity-90 transition-opacity duration-1000 ease-in-out bg-neutral-200 dark:bg-gray-800 dark:text-white text-dark-200 text-xs rounded-full px-2 py-1 ${
                            isActive ? "block animate-name-reveal" : "hidden"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {/* Notification dot for specific links */}
                      {item.hasNotification && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
