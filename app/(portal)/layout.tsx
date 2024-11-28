// import Bottombar from "@/components/utilities/Bottombar";
// import DarkModeToggle from "@/components/utilities/DarkModeToggle";

// import LeftSidebar from "@/components/utilities/LeftSidebar";
// import Topbar from "@/components/utilities/Topbar";
// import { useThem} from "@/components/utilities/ThemeChat";
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
        <aside className="   fixed top-0 left-0 h-full w-[250px]">
          {" "}
          {/* Adjust width as needed */}
          {/* <LeftSidebar /> */}
        </aside>
        {/* Main Content Area */}
        <div className="xl:ml-[250px] xl:mr-[200px] mb-[50px] mt-[80px] md:ml-[180px] md:mr-[100px] flex-1 flex h-full flex-col">
          {/* Top Bar */}
          {/* Content */}
          {/* Same width as sidebar to offset it */}
          <section className="flex-1 mt-7">{children}</section>{" "}
          <aside className=" hidden md:block xl:block  fixed bottom-24 left-4 z-50">
            {/* <DarkModeToggle /> */}
          </aside>
        </div>{" "}
      </AuthProvider>
    </main>
  );
}
