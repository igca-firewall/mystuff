"use client"

import { getMe } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const xed = await getMe(); // Assuming getMe is asynchronous
  //       if (xed) {
  //         // If the user is authenticated, redirect to the home page
  //         redirect("/"); // Client-side redirect
  //       }
  //     } catch (error) {
  //       console.error("Error checking authentication:", error);
  //     }
  //   };

  //   checkAuthentication();
  // }, []); // Empty dependency array ensures this runs only once, after the component mounts

  return <main className="justify-center">{children}</main>;
}
