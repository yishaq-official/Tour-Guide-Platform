import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ShieldAlert, ChevronDown, User, Layers } from 'lucide-react';
import { useSession, signOut } from '../../lib/auth-client';

export function PartnerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/partner');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'hotel':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">Hotel Partner</span>;
      case 'car':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold">Car Rental Partner</span>;
      case 'agency':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2 py-0.5 rounded-full font-bold">Agency Partner</span>;
      case 'admin':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] px-2 py-0.5 rounded-full font-bold">System Admin</span>;
      default:
        return null;
    }
  };

  const isDashboard = location.pathname.startsWith('/partner/dashboard');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/partner" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="TravelAssist Logo" className="h-10 w-auto object-contain" />
              <span className="text-xl font-black text-green-700 tracking-tight flex items-center">
                Travel<span className="text-gray-900">Assist</span> <span className="text-gray-400 font-medium text-sm ml-1.5 border-l border-gray-200 pl-2">Partner Portal</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            {!isDashboard && (
              <div className="hidden md:flex ml-10 space-x-8">
                <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Commission
                </a>
                <a href="#faq" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  FAQs
                </a>
              </div>
            )}
          </div>

          {/* Desktop Right Buttons / User Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all border border-gray-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-green-50 text-green-700 flex items-center justify-center font-bold text-sm">
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-900 leading-tight">{session.user.name}</div>
                    <div className="text-[9px] text-gray-400 font-semibold leading-none">{(session.user as any).role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-40"
                      >
                        <div className="px-4 py-2 border-b border-gray-50 mb-2">
                          <div className="text-xs text-gray-400 font-medium">Signed in as</div>
                          <div className="text-sm font-bold text-gray-800 truncate">{session.user.email}</div>
                          <div className="mt-1.5">{getRoleBadge((session.user as any).role)}</div>
                        </div>

                        {!isDashboard && ['hotel', 'car', 'agency', 'admin'].includes((session.user as any).role) && (
                          <Link
                            to="/partner/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors font-semibold"
                          >
                            <Layers className="w-4 h-4 mr-2" /> Partner Dashboard
                          </Link>
                        )}

                        {(session.user as any).role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors font-semibold"
                          >
                            <ShieldAlert className="w-4 h-4 mr-2" /> Admin Panel
                          </Link>
                        )}

                        <Link
                          to="/"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors font-semibold"
                        >
                          <User className="w-4 h-4 mr-2" /> Return to TravelAssist
                        </Link>

                        <div className="h-px bg-gray-150/50 my-2" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup?role=hotel"
                  className="text-sm font-bold bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-green-600/10"
                >
                  Register Partner
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {!isDashboard && (
                <>
                  <a
                    href="#features"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Commission
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  >
                    FAQs
                  </a>
                </>
              )}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-4 pb-3 border-t border-gray-100 px-4">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold">
                      {session.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-800 leading-tight">{session.user.name}</div>
                      <div className="text-sm text-gray-500 truncate">{session.user.email}</div>
                    </div>
                  </div>
                  <div className="mt-1">{getRoleBadge((session.user as any).role)}</div>

                  {!isDashboard && ['hotel', 'car', 'agency', 'admin'].includes((session.user as any).role) && (
                    <Link
                      to="/partner/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-green-600"
                    >
                      Partner Dashboard
                    </Link>
                  )}

                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Return to TravelAssist
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-3 py-2 rounded-xl text-base font-bold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center block px-4 py-2.5 text-base font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup?role=hotel"
                    onClick={() => setIsOpen(false)}
                    className="text-center block px-4 py-2.5 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  >
                    Register Partner
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
