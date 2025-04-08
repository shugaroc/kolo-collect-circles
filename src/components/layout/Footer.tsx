
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-kolo-purple">KoloCollect</h3>
            <p className="text-sm text-gray-600 mt-1">
              A modern way to manage community savings.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-4 md:mb-0">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-kolo-purple">Dashboard</Link>
                </li>
                <li>
                  <Link to="/communities" className="text-gray-600 hover:text-kolo-purple">Communities</Link>
                </li>
                <li>
                  <Link to="/wallet" className="text-gray-600 hover:text-kolo-purple">Wallet</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-sm">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/profile" className="text-gray-600 hover:text-kolo-purple">Profile</Link>
                </li>
                <li>
                  <Link to="/settings" className="text-gray-600 hover:text-kolo-purple">Settings</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-kolo-purple">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-kolo-purple">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-kolo-purple">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 text-center text-sm text-gray-500">
          <p>© {year} KoloCollect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
