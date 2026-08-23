import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import KhandaIcon from './KhandaIcon';

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <KhandaIcon className="text-saffron" size={28} />
            <h3 className="font-bold text-lg">Gurudwara Guru Singh Sabha</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            A sacred place of worship, community service, and spiritual growth. All are welcome to join us for prayers, kirtan, and langar seva.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-saffron mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm">
            {['/', '/history', '/events', '/gallery', '/donate', '/contact'].map((path) => (
              <Link key={path} to={path} className="block text-gray-300 hover:text-saffron transition-colors">
                {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-saffron mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-saffron" /> Bikaner Road, Suratgarh - 335804</p>
            <p className="flex items-center gap-2"><FaPhone className="text-saffron" /> +91 8000725706</p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-saffron" /> info@gurudwara.org</p>
          </div>
        </div>
      </div>
      <div className="border-t border-navy-light text-center py-4 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Gurudwara Management System. Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.
      </div>
    </footer>
  );
}
