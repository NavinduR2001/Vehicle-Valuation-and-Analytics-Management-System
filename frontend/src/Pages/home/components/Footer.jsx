import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight, FiSend } from 'react-icons/fi';
import Logo from '../../../assets/img/Logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-overlay"></div>
      
      <div className="footer-container">
        <div className="newsletter-wrapper">
          <div className="newsletter-text">
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get the latest updates and special offers directly to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <NewsletterForm />
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-col company-info">
            <img src={Logo} alt="Rawan Auto Care" className="footer-logo-img" />
            <p className="footer-desc">
              Your trusted partner for premium vehicle service, aftercare, and import. We deliver excellence and reliability for all your automotive needs.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FiFacebook /></a>
              <a href="https://twitter.com" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><FiTwitter /></a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FiInstagram /></a>
              <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FiLinkedin /></a>
            </div>
          </div>
          
          <div className="footer-col quick-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home"><FiArrowRight className="link-icon" /> Home</a></li>
              <li><a href="#about"><FiArrowRight className="link-icon" /> About Us</a></li>
              <li><a href="#services"><FiArrowRight className="link-icon" /> Our Services</a></li>
              {/* <li><a href="#brands"><FiArrowRight className="link-icon" /> Brands</a></li> */}
              <li><a href="#contact"><FiArrowRight className="link-icon" /> Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-col services-links">
            <h4 className="footer-title">Our Services</h4>
            <ul className="footer-links">
              <li><span className="service-item">Vehicle Repair</span></li>
              <li><span className="service-item">Periodic Maintenance</span></li>
              <li><span className="service-item">Collision Repair</span></li>
              <li><span className="service-item">Auto Detailing</span></li>
              <li><span className="service-item">Mobile First Aid</span></li>
            </ul>
          </div>
          
          <div className="footer-col contact-info">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <div className="contact-icon"><FiMapPin /></div>
                <div className="contact-text">
                  <span>Head Office</span>
                  <p>Balangoda, Sri Lanka</p>
                </div>
              </li>
              <li className="contact-item">
                <div className="contact-icon"><FiPhone /></div>
                <div className="contact-text">
                  <span>Hotline</span>
                  <p><a href="tel:+94112345678">+94 11 234 5678</a></p>
                </div>
              </li>
              <li className="contact-item">
                <div className="contact-icon"><FiMail /></div>
                <div className="contact-text">
                  <span>Email</span>
                  <p><a href="mailto:info@vehicare.com">info@vehicare.com</a></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
          <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} Rawan Auto Care (Pvt) Ltd. All Rights Reserved.
          </div>
          {/* <div className="footer-bottom-links">
            <a href="#contact">Privacy Policy</a>
            <span className="divider">|</span>
            <a href="#contact">Terms of Service</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

function NewsletterForm(){
  const [email,setEmail]=useState('');
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!email) return;
    // lightweight UX: show confirmation
    window.alert(`Thanks — subscribed: ${email}`);
    setEmail('');
  }
  return (
    <>
      <input type="email" placeholder="Your Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} required />
      <button type="submit" className="btn-primary" onClick={handleSubmit} aria-label="Subscribe">
        <FiSend /> Subscribe
      </button>
    </>
  )
}

export default Footer;
