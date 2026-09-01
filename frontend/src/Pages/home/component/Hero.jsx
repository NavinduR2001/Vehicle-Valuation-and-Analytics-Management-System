import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWrench, FaCar, FaShieldAlt, FaSprayCan } from 'react-icons/fa';
import './Hero.css';

import sampleBg1 from '../../../assets/sample bg 1.png';
import sampleBg2 from '../../../assets/sample bg 2.jpg';
import sampleBg4 from '../../../assets/sample bg 4.png';

const slides = [
  {
    id: 1,
    subtitle: 'Professional Vehicle Valuation',
    title: 'Our',
    titleHighlight: 'Strategy',
    description:
      'Providing high quality productive services related to vehicle and machinery valuation for the banking and finance sector using modern automobile engineering technology and industry expertise.',
    bg: sampleBg1,
    icon: <FaWrench />,
  },
  {
    id: 2,
    subtitle: 'Trusted Industry Leadership',
    title: 'Our',
    titleHighlight: 'Vision',
    description:
      'To be the most reliable and best vehicle valuation service provider in the world, delivering trusted solutions with professionalism and accuracy.',
    bg: sampleBg2,
    icon: <FaCar />,
  },
  {
    id: 3,
    subtitle: 'Integrity & Accountability',
    title: 'Our',
    titleHighlight: 'Mission',
    description:
      'To enhance the quality of vehicle and machinery valuation services while supporting customers and financial organizations with integrity, accountability, and excellence.',
    bg: sampleBg4,
    icon: <FaShieldAlt />,
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const goToSlide = useCallback((index, dir = 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length, 'next');
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length, 'prev');
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="hero" id="home">
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-bg ${i === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.bg})` }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-container">
        <div className="hero-content-wrapper">
          {/* Left Content */}
          <div className={`hero-content ${isAnimating ? `animating-${direction}` : ''}`}>
            <div className="hero-subtitle-badge">
              <span className="hero-icon">{slide.icon}</span>
              <span>{slide.subtitle}</span>
            </div>
            <h1 className="hero-title">
              {slide.title}
              <br />
              <span className="hero-title-highlight">{slide.titleHighlight}</span>
            </h1>
            <p className="hero-description">{slide.description}</p>
            <div className="hero-buttons">
               <RouterLink to="/register" className="hero-btn">
                Explore Services <FiArrowRight />
              </RouterLink>
              
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className={`hero-image-wrapper ${isAnimating ? `animating-${direction}` : ''}`}>
            <div className="hero-image-glow" />
            {/* <img
              src={slide.image}
              alt={slide.title}
              className="hero-main-image"
            /> */}
          </div>
        </div>

        {/* Slide Controls */}
        <div className="hero-controls">
          <div className="hero-nav-arrows">
            <button className="hero-arrow" onClick={prevSlide} aria-label="Previous slide">
              <FiChevronLeft />
            </button>
            
          </div>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(i, i > currentSlide ? 'next' : 'prev')}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          
          <div className="hero-nav-arrows">
            <button className="hero-arrow" onClick={nextSlide} aria-label="Next slide">
              <FiChevronRight />
            </button>
            
            
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="hero-decoration-line" />
    </section>
  );
};

export default Hero;
