
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "./Footer";

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {user && <Sidebar />}
        
        <main className={`flex-1 p-6 ${user ? 'md:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
