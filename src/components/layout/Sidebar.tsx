import { Button } from "@/components/ui/button";
import { 
  CircleDollarSign, 
  Home, 
  LayoutDashboard, 
  Users, 
  Wallet,
  Settings,
  HelpCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "My Circles", path: "/communities", icon: <CircleDollarSign className="h-5 w-5" /> },
    { name: "Members", path: "/members", icon: <Users className="h-5 w-5" /> },
    { name: "Contributions", path: "/contributions", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Wallet", path: "/wallet", icon: <Wallet className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <aside className="h-screen bg-white border-r border-gray-200 fixed top-0 left-0 pt-16 w-64 z-20 transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive(item.path) 
                      ? "bg-kolo-purple text-white hover:bg-kolo-purple hover:text-white" 
                      : "hover:bg-kolo-soft-gray"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <nav className="space-y-1">
            <Link to="/settings">
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive("/settings") 
                    ? "bg-kolo-purple text-white hover:bg-kolo-purple hover:text-white" 
                    : "hover:bg-kolo-soft-gray"
                }`}
              >
                <span className="mr-3"><Settings className="h-5 w-5" /></span>
                Settings
              </Button>
            </Link>
            <Link to="/help">
              <Button
                variant={isActive("/help") ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive("/help") 
                    ? "bg-kolo-purple text-white hover:bg-kolo-purple hover:text-white" 
                    : "hover:bg-kolo-soft-gray"
                }`}
              >
                <span className="mr-3"><HelpCircle className="h-5 w-5" /></span>
                Help & Support
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
