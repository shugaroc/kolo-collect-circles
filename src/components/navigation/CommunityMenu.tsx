
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "@/components/ui/menubar";
import { useLocation, Link } from "react-router-dom";
import { CircleDollarSign, Globe, Users } from "lucide-react";

const CommunityMenu = () => {
  const location = useLocation();
  
  return (
    <Menubar className="mb-6 border-none">
      <MenubarMenu>
        <MenubarTrigger className="font-semibold">
          <CircleDollarSign className="h-4 w-4 mr-2" />
          Communities
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link to="/communities" className={`${location.pathname === '/communities' ? 'bg-muted' : ''} w-full`}>
              <Users className="h-4 w-4 mr-2" />
              My Circles
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/communities/public" className={`${location.pathname === '/communities/public' ? 'bg-muted' : ''} w-full`}>
              <Globe className="h-4 w-4 mr-2" />
              Public Circles
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default CommunityMenu;
