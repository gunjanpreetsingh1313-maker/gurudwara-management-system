import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import KhandaIcon from './KhandaIcon';

const links = [
  { to: '/', label: 'Home' },
  { to: '/history', label: 'History' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/donate', label: 'Donate' },
  { to: '/finances', label: 'Finances' },
  { to: '/committee', label: 'Committee' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <KhandaIcon className="text-saffron" size={58} /> 
            
            <span>Gurudwara Guru Singh Sabha
              
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.to ? 'bg-saffron text-white' : 'hover:bg-navy-light'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/admin/login" className="ml-2 px-4 py-2 bg-saffron hover:bg-saffron-dark rounded-lg text-sm font-medium transition-colors">
              Admin
            </Link>
          </div>
          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`block px-3 py-2 rounded-lg ${pathname === l.to ? 'bg-saffron' : 'hover:bg-navy-light'}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="block px-3 py-2 bg-saffron rounded-lg text-center">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
