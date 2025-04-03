
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kolo-soft-gray">
      <div className="text-center">
        <div className="mb-6 inline-block bg-kolo-purple rounded-full p-4">
          <CircleDollarSign className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-kolo-dark-gray">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button size="lg" className="font-medium">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
