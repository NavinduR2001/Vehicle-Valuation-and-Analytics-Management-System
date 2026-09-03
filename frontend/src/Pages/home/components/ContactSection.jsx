import React, { useState, useRef, useEffect } from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import './ContactSection.css';

const ContactSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section className={`contact-section ${visible ? 'visible' : ''}`} id="contact" ref={ref}>
      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-form">
            <h3>Get in touch with us!</h3>
            <p className="contact-lead">Have questions or need a valuation? Send us a message and we'll respond within 24 hours.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              const name = data.get('name') || '';
              const email = data.get('email') || '';
              const phone = data.get('phone') || '';
              const message = data.get('message') || '';
              const subject = encodeURIComponent('Website enquiry from ' + name);
              const body = encodeURIComponent(`Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0A%0A${message}`);
              window.location.href = `mailto:ravanautocare@gmail.com?subject=${subject}&body=${body}`;
            }}>
              <div className="form-row">
                <input name="name" placeholder="Your name" required />
                <input name="email" type="email" placeholder="Email address" required />
              </div>
              <div className="form-row">
                <input name="phone" placeholder="Phone (optional)" />
              </div>
              <div className="form-row">
                <textarea name="message" placeholder="How can we help you?" rows={6} required></textarea>
              </div>
              <div className="form-row">
                <button type="submit" className="btn-primary">Send Message</button>
              </div>
            </form>
          </div>

          <aside className="contact-details">
           
            <div className="detail-item"><FiPhone /> <a href="tel:+94112345678">077 736 5498</a></div>
            <div className="detail-item"><FiMail /> <a href="mailto:ravanautocare@gmail.com">ravanautocare@gmail.com</a></div>
            <div className="detail-item"><FiMapPin /> Balangoda, Sri Lanka</div>
            <hr />
            <h5 style={{marginTop:'10px'}}>Business hours</h5>
            <p>Mon - Fri: 8:30 AM – 5:30 PM<br/>Sat: 9:00 AM – 1:00 PM</p>
            <div className="map-wrap">
              <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31672.26833157108!2d80.66346045!3d6.66234765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3e8a1d0e7c2e3%3A0x7e247cbccfbbf4df!2sBalangoda!5e0!3m2!1sen!2slk!4v1700000000000" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
