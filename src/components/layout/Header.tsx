
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Plus, X } from "lucide-react";
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [notifications, setNotifications] = useState<number>(3);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="md:hidden"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-kolo-purple rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <h1 className="text-xl font-bold text-kolo-purple hidden sm:inline-block">KoloCollect</h1>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/communities/new">
          <Button variant="outline" size="sm" className="hidden md:flex gap-1">
            <Plus className="h-4 w-4" />
            <span>New Circle</span>
          </Button>
        </Link>
        
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-kolo-light-purple text-white">JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/wallet" className="w-full">Wallet</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
