
import { Link } from "react-router-dom";
import { ExternalLink, Mail, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-kolo-purple rounded-full flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="ml-2 font-semibold text-gray-800">KoloCollect</span>
            <span className="ml-2 text-sm text-gray-500">© {currentYear}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/about" className="text-gray-600 hover:text-kolo-purple transition-colors">
              About
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-kolo-purple transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-kolo-purple transition-colors">
              Privacy
            </Link>
            <Link to="/faq" className="text-gray-600 hover:text-kolo-purple transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-kolo-purple transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex gap-4">
            <a 
              href="mailto:support@kolocollect.com" 
              className="text-gray-600 hover:text-kolo-purple transition-colors"
              aria-label="Email Support"
            >
              <Mail size={18} />
            </a>
            <a 
              href="https://github.com/kolocollect" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-kolo-purple transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a 
              href="https://kolocollect.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-kolo-purple transition-colors"
              aria-label="Website"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
