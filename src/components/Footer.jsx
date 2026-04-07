import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Veg Pickles', href: '/veg-pickles' },
    { name: 'Non Veg Pickles', href: '/non-veg-pickles' },
    { name: 'Podis', href: '/podis' },
    { name: 'Sweets', href: '/sweets' },
    { name: 'Snacks', href: '/snacks' },
  ];

  const policyLinks = [
    { name: 'Terms & Conditions', href: '/terms-and-conditions.html' },
    { name: 'Shipping Policy', href: '/shipping-policy.html' },
    { name: 'Refund and Return Policy', href: '/refund-return-policy.html' },
    { name: 'Privacy Policy', href: '/privacy-policy.html' },
  ];

  return (
    <footer
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/FooterBg.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="font-rubik font-bold text-[22px] text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 font-montserrat text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="font-rubik font-bold text-[22px] text-white mb-6">
              Policies
            </h3>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 font-montserrat text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-rubik font-bold text-[22px] text-white mb-6">
              Contact Information
            </h3>
            <div className="space-y-4">
              <p className="font-rubik font-semibold text-white text-lg">
                Samskruthi Home Foods
              </p>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a
                  href="tel:+918500677977"
                  className="text-white/80 hover:text-white transition-colors duration-200 font-montserrat text-sm"
                >
                  +91 8500677977
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a
                  href="mailto:manasamskruthihomefoods@gmail.com"
                  className="text-white/80 hover:text-white transition-colors duration-200 font-montserrat text-sm break-all"
                >
                  manasamskruthihomefoods@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-white/80 font-montserrat text-sm leading-relaxed">
                  41, Road No. 1, Srinivasa Nagar Bank Colony,
                  <br />
                  Kanuru, Andhra Pradesh 520008
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
