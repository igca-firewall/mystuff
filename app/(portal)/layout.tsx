
import LeftSidebar from "@/components/utilities/LeftSidebar";
import Topbar from "@/components/utilities/Topbar";
import {  sidebarLinks } from "@/constants";
import AuthProvider from "@/context/AuthContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-full flex font-inter">
      <AuthProvider>
        {/* Fixed Left Sidebar */}
        <Topbar links={sidebarLinks} />
        <aside className="fixed top-0 left-0 h-full w-[250px]">
          {/* Adjust width as needed */}
          <LeftSidebar />
        </aside>
        {/* Main Content Area */}
        <div className="xl:ml-[250px] xl:mr-[200px] md:ml-[180px] md:mr-[100px] flex-1 flex h-full flex-col mt-[80px]">
          <section className="flex-1 w-full h-full p-4">{children}</section>
          <aside className="hidden md:block xl:block fixed bottom-24 left-4 z-50">
            {/* <DarkModeToggle /> */}
          </aside>
     
        </div>
      </AuthProvider>
    </main>
  );
}
