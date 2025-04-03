
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-kolo-soft-gray">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <main className={`transition-all duration-300 pt-16 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <div className="container py-8 px-4 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
