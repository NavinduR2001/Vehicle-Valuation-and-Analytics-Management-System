import React from 'react';
import { LogoNew } from '../../assets/assets';
import './Footer.css';

function Footer() {
  const quickLinks = ['Home', 'Valuation', 'About', 'Contact'];
  const socialLinks = ['Facebook', 'Instagram', 'Twitter', 'Whatsapp'];

  return (
    <footer className="footer">
      <div className="footer-red-bar-top"></div>
      
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Logo + Contact + Description */}
          <div className="footer-column">
            <div className="footer-logo-section">
              <div className="footer-logo-box">
                <img src={LogoNew} alt="Ravan Auto Cars" className="footer-logo" />
              </div>
              <div className="footer-contact">
                <p>+94 123 1234</p>
                <p>Kirimettihinna, Balangoda</p>
                <p>ravanautocare@gmail.com</p>
              </div>
            </div>
            <p className="footer-description">
              Vehicle Valuation System helps users accurately estimate the market value of
              vehicles based on real-time data, model details, and condition. Designed for
              transparency and reliability, this system simplifies buying, selling, and
              comparing vehicles with confidence.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#">
                    <span className="arrow">›</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Social Links</h3>
            <ul className="footer-links">
              {socialLinks.map((link) => (
                <li key={link}>
                  <a href="#">
                    <span className="arrow">›</span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-column">
            <h3 className="footer-heading">News Letter</h3>
            <p className="footer-newsletter-text">
              Subscribe Our Newsletter to Get Latest News and Updates from Us
            </p>
            <form className="footer-newsletter-form">
              <input type="email" placeholder="Your Email" className="footer-input" />
              <button type="submit" className="footer-button">Subscribe Now !</button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>@Copyright 2025 | <span className="footer-brand">RAVAN</span> Auto Care All Rights Reserved.</p>
        </div>
      </div>

      <div className="footer-red-bar-bottom"></div>
    </footer>
  );
}

export default Footer;