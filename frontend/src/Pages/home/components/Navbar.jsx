import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiChevronDown, FiLogIn, FiLogOut } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaRegistered, FaUniregistry, FaUser, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import Logo from '../../../assets/img/Logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    // { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`} id="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a href="#home" className="navbar-logo">
          <img src={Logo} alt="Rawan Auto Care" className="logo-img" />
        </a>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <div className="nav-social-links">
            <a href="#" className="social-icon-nav"><FaFacebookF /></a>
            <a href="#" className="social-icon-nav"><FaInstagram /></a>
            <a href="#" className="social-icon-nav"><FaWhatsapp /></a>
          </div>

          <RouterLink to="/login" className="nav-cta-btn">
            <FiLogIn />
            <span>Log in</span>
          </RouterLink>

          <RouterLink to="/register" className="nav-cta-btn">
            <FaUser />
            <span>Register</span>
          </RouterLink>

        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
        <div className="mobile-menu-actions">
          <a href="tel:+94112345678" className="btn-primary" style={{width: '100%', justifyContent: 'center'}}>
            <FiPhone /> Call Now
          </a>
          <div className="mobile-social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
