
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = ["/auth", "/"];

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        location.pathname === route || location.pathname.startsWith(`${route}/`)
      );

      if (!user && !isPublicRoute) {
        // Redirect to auth page if trying to access private route without authentication
        navigate("/auth", { state: { from: location.pathname } });
      } else if (user && location.pathname === "/auth") {
        // Redirect to dashboard if already authenticated and trying to access auth page
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading) {
    // You could show a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

export default RouteGuard;
