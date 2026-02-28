import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Twitter,
  Facebook,
  Youtube,
  Shield,
  Mail,
  MapPin,
  Phone,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  editMode?: boolean;
}

export function Footer({ editMode = false }: FooterProps) {
  const context = useSite();
  if (!context) return null;

  const { content, updateContent } = context;

  const [editing, setEditing] = useState<string | null>(null);
  const [tempVal, setTempVal] = useState('');

  const startEdit = (field: string, val: string) => {
    setEditing(field);
    setTempVal(val || '');
  };

  const saveEdit = (field: string) => {
    updateContent({ [field]: tempVal } as any);
    setEditing(null);
  };

  const EditableText = ({ field, value, className }: { field: string; value: string; className?: string }) =>
    editing === field ? (
      <span className="flex items-center gap-1">
        <input
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          className="bg-white/20 text-white px-2 py-0.5 rounded text-sm flex-1 min-w-0"
          autoFocus
        />
        <button onClick={() => saveEdit(field)} className="text-gold shrink-0">
          <Check size={12} />
        </button>
        <button onClick={() => setEditing(null)} className="text-red-400 shrink-0">
          <X size={12} />
        </button>
      </span>
    ) : (
      <span className={`${className || ''} flex items-center gap-1 group`}>
        {value || 'Add Information'}
        {editMode && (
          <button
            onClick={() => startEdit(field, value)}
            className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-gold ml-1"
          >
            <Pencil size={10} />
          </button>
        )}
      </span>
    );

  const socialIcons: Record<string, React.ReactNode> = {
    Facebook: <Facebook size={18} />,
    Twitter: <Twitter size={18} />,
    YouTube: <Youtube size={18} />
  };

  return (
    <footer className="bg-navy text-white pt-14 pb-6 border-t-4 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="bg-gold p-1.5 rounded-lg">
                <Shield className="h-5 w-5 text-navy" />
              </div>
              <span className="font-heading text-xl text-white">{content?.logoText || 'IYSDI'}</span>
            </div>

            <EditableText
              field="footerTagline"
              value={content?.footerTagline || ''}
              className="text-gray-300 text-sm leading-relaxed block"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg mb-5 text-gold">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', text: 'Home' },
                { to: '/#about', text: 'About IYSDI' },
                { to: '/event', text: 'Event Schedule' },
                { to: '/login', text: 'Portal Login' }
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="h-1 w-1 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h3 className="font-heading text-lg mb-5 text-gold">Sports</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {['🏀 Basketball', '🏐 Volleyball', '⚾ Baseball', '⚽ Football', '🏸 Badminton'].map((s) => (
                <li key={s} className="hover:text-white transition-colors cursor-pointer">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg mb-5 text-gold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <EditableText field="footerAddress" value={content?.footerAddress || ''} />
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <EditableText field="footerEmail" value={content?.footerEmail || ''} />
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <EditableText field="footerPhone" value={content?.footerPhone || ''} />
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-white/10 pt-8 pb-6 text-center">
          <h3 className="font-heading text-lg text-gold mb-4">Follow Us</h3>

          <div className="flex justify-center space-x-4">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/ifysdi_?igsh=NHBwM2w3bHAxcGQ1"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-3 rounded-full hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-400 transition-all flex items-center justify-center"
              title="Follow us on Instagram"
            >
              {/* ✅ Production-safe path */}
              <img src="/images/Instagram.jpg" alt="Instagram" className="h-5 w-5 object-contain" />
            </a>

            {/* Other Social Links */}
            {content?.socialLinks
              ?.filter((s: SocialLink) => s.platform !== 'Instagram')
              .map((s: SocialLink) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full text-white hover:bg-gold hover:text-navy transition-all flex items-center justify-center"
                >
                  {socialIcons[s.platform] || <Twitter size={18} />}
                </a>
              ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <EditableText
            field="copyrightText"
            value={content?.copyrightText || '© 2026 IYSDC'}
            className="text-gray-400 text-xs"
          />
          <div className="flex space-x-5 text-xs text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}