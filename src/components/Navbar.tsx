import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Pencil, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';

interface NavbarProps {
  editMode?: boolean;
}

interface NavLinkItem {
  name: string;
  path: string;
}

export function Navbar({ editMode = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editingLogo, setEditingLogo] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(false);
  const [tempLogo, setTempLogo] = useState('');
  const [tempAnnouncement, setTempAnnouncement] = useState('');
  
  const location = useLocation();
  const { content, updateContent } = useSite();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isDashboard = ['/admin', '/super-admin', '/coach', '/scout'].some((p) =>
    location.pathname.startsWith(p)
  );

  if (isDashboard) return null;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gold text-navy text-center text-xs font-semibold py-1.5 px-4 relative z-50 h-8">
        {editMode && editingAnnouncement ? (
          <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
            <input
              value={tempAnnouncement}
              onChange={(e) => setTempAnnouncement(e.target.value)}
              className="flex-1 bg-white/80 text-navy px-2 py-0.5 rounded text-xs outline-none"
              autoFocus
            />
            <button
              onClick={() => {
                updateContent({ announcementBar: tempAnnouncement });
                setEditingAnnouncement(false);
              }}
              className="bg-navy text-white px-2 py-0.5 rounded text-xs flex items-center gap-1"
            >
              <Check size={10} /> Save
            </button>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {content.announcementBar}
            {editMode && (
              <button
                onClick={() => {
                  setTempAnnouncement(content.announcementBar);
                  setEditingAnnouncement(true);
                }}
                className="ml-2 opacity-60 hover:opacity-100"
              >
                <Pencil size={10} />
              </button>
            )}
          </span>
        )}
      </div>

      {/* Navigation Bar */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-navy/97 backdrop-blur-md shadow-lg py-2' : 'bg-navy py-3'
        }`}
        style={{ top: '32px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gold p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-navy" />
              </div>
              {editMode && editingLogo ? (
                <div className="flex items-center gap-1">
                  <input
                    value={tempLogo}
                    onChange={(e) => setTempLogo(e.target.value)}
                    className="bg-white/20 text-white px-2 py-0.5 rounded text-lg font-heading w-32 outline-none border border-white/10"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      updateContent({ logoText: tempLogo });
                      setEditingLogo(false);
                    }}
                    className="text-gold"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <span className="font-heading text-xl text-white flex items-center gap-1">
                  {content.logoText}
                  {editMode && (
                    <button
                      onClick={() => {
                        setTempLogo(content.logoText);
                        setEditingLogo(true);
                      }}
                      className="ml-1 opacity-40 hover:opacity-100 text-gold"
                    >
                      <Pencil size={10} />
                    </button>
                  )}
                </span>
              )}
            </Link>

            {/* Desktop Nav - FIXED MAPPING */}
            <div className="hidden md:flex items-center space-x-6">
              {(content.navLinks || []).map((link: NavLinkItem) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white/80 hover:text-gold font-medium transition-colors text-sm uppercase tracking-wide"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-5 py-2 bg-gold text-navy hover:bg-[#e6be3e] rounded-full font-bold transition-all text-sm uppercase tracking-wide"
              >
                Login
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white hover:text-gold transition-colors"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - FIXED MAPPING */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-navy border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-3">
                {(content.navLinks || []).map((link: NavLinkItem) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-white/80 hover:text-gold font-medium text-base py-2 border-b border-white/5"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="block w-full text-center mt-4 px-6 py-3 bg-gold text-navy rounded-lg font-bold"
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div style={{ height: '88px' }} />
    </>
  );
}