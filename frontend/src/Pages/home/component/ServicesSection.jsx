import { useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import "./ServicesSection.css";
import sampleBg1 from "../../../assets/sample bg 1.png";
import sampleBg2 from "../../../assets/sample bg 2.jpg";
import sampleBg3 from "../../../assets/sample bg 3.png";
import sampleBg4 from "../../../assets/sample bg 4.png";

const services = [
  {
    id: 1,
    title: "Vehical &  Machinary valuation ",
    description:
      "We provide accurate and reliable valuation services for vehicles and machinery, helping you make informed decisions with confidence.",
    image: sampleBg1,
    className: "bento-box-normal",
  },
  {
    id: 2,
    title: "Vehical Fitness report",
    description:
      "Our comprehensive vehicle fitness reports ensure your vehicle meets safety and performance standards.",
    image: sampleBg2,
    className: "bento-box-normal",
  },
  {
    id: 3,
    title: "Insurance assessment ",
    description:
      "Our insurance assessment services provide accurate evaluations to help you secure the right coverage for your vehicle.",
    image: sampleBg3,
    className: "bento-box-normal",
  },
  {
    id: 4,
    title: "Valuation second Opinion",
    description:
      "Get a second opinion on your vehicle valuation with our expert assessment services, ensuring you receive a fair and accurate evaluation.",
    image: sampleBg4,
    className: "bento-box-normal",
  },
];

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* <section className="about-section" ref={sectionRef} id="about">
        <div className={`about-container ${isVisible ? "visible" : ""}`}>
          <div className="services-header text-center">
            <span className="section-subtitle">Our Story</span>
            <h2 className="section-title">Learn More About Our Company</h2>
          </div>
        </div>
      </section> */}

      <section className="services-section" ref={sectionRef} id="services">
        <div className={`services-container ${isVisible ? "visible" : ""}`}>
          <div className="services-header text-center">
            <span className="section-subtitle">Our Services</span>
            <h2 className="section-title">What Services We Offering</h2>
          </div>

          <div className="services-bento-grid">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`bento-card ${service.className} ${isVisible ? "animate-fade-in-up" : ""}`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "both",
                  backgroundImage: `url(${service.image})`,
                }}
              >
                <div className="bento-overlay"></div>

                <div className="bento-content">
                  <h3 className="bento-title">{service.title}</h3>
                  <p className="bento-desc">{service.description}</p>
                  <button className="bento-link">
                    Get a Service <FiChevronRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;
