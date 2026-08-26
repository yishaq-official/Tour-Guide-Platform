import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t-4 border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="TravelAssist Logo" className="h-10 w-auto object-contain brightness-110" />
              <span className="font-bold text-xl text-white tracking-tight">
                Travel<span className="text-green-500">Assist</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your comprehensive guide to exploring the rich heritage, vibrant culture, and stunning landscapes of Ethiopia.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">UNESCO Heritages</Link></li>
              <li><Link to="/explore" className="hover:text-white transition-colors">Historical Places</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Hotels & Stays</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Car Rentals</Link></li>
            </ul>
          </div>

          {/* Tourist Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tourist Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/transport" className="hover:text-white transition-colors">Transport & Travel</Link></li>
              <li><Link to="/essentials" className="hover:text-white transition-colors">Visa Requirements</Link></li>
              <li><Link to="/essentials" className="hover:text-white transition-colors">SIM & Telecom</Link></li>
              <li><Link to="/essentials" className="hover:text-white transition-colors">Banking & ATMs</Link></li>
              <li><Link to="/essentials" className="hover:text-white transition-colors">Emergency Contacts</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <span>info@travelassist.et</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} TravelAssist Ethiopia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
