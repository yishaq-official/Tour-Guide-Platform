import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Navigation, Building, ShieldAlert } from 'lucide-react';
import { useSession, signOut } from '../../lib/auth-client';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'Services', path: '/services' },
  { name: 'Essentials', path: '/essentials' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Subtle Ethiopian Flag Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/images/logo.png" 
              alt="TravelAssist Logo" 
              className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
            />
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Travel<span className="text-green-700">Assist</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative px-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full border border-gray-200 hover:border-green-500 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{session.user.name?.split(' ')[0]}</span>
                </button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <Link to="/my-trips" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
                        <Navigation className="w-4 h-4 mr-2" /> My Trips
                      </Link>
                      
                      {session.user && ['hotel', 'car', 'agency'].includes((session.user as any).role) && (
                        <Link to="/partner/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
                          <Building className="w-4 h-4 mr-2" /> Partner Dashboard
                        </Link>
                      )}

                      {session.user && (session.user as any).role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
                          <ShieldAlert className="w-4 h-4 mr-2" /> Admin Panel
                        </Link>
                      )}

                      <div className="h-px bg-gray-100 my-2" />
                      <button onClick={handleSignOut} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                <Link to="/signup" className="text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {!isPending && (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  {session ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                          {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{session.user.name}</div>
                          <div className="text-xs text-gray-500">{session.user.email}</div>
                        </div>
                      </div>
                      <Link
                        to="/my-trips"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors"
                      >
                        <Navigation className="w-5 h-5 inline mr-2" /> My Trips
                      </Link>

                      {session.user && ['hotel', 'car', 'agency'].includes((session.user as any).role) && (
                        <Link
                          to="/partner/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors"
                        >
                          <Building className="w-5 h-5 inline mr-2" /> Partner Dashboard
                        </Link>
                      )}

                      {session.user && (session.user as any).role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors"
                        >
                          <ShieldAlert className="w-5 h-5 inline mr-2" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { setIsOpen(false); handleSignOut(); }}
                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5 inline mr-2" /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 px-3">
                      <Link to="/login" onClick={() => setIsOpen(false)} className="flex justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Sign In
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)} className="flex justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
