import './BrandSection.css';
import { SiToyota, SiHonda, SiBmw, SiNissan, SiHyundai, SiSuzuki, SiFord, SiMitsubishi, SiMazda} from 'react-icons/si';

const brands = [
  { name: 'Toyota', icon: <SiToyota /> },
  { name: 'Honda', icon: <SiHonda /> },
  { name: 'BMW', icon: <SiBmw /> },
  { name: 'Nissan', icon: <SiNissan /> },
  { name: 'Hyundai', icon: <SiHyundai /> },
  { name: 'Suzuki', icon: <SiSuzuki /> },
  { name: 'Ford', icon: <SiFord /> },
  { name: 'Mitsubishi', icon: <SiMitsubishi /> },
  { name: 'Mazda', icon: <SiMazda/> },
];

const BrandSection = () => {
  // Duplicate brands for infinite scroll
  const allBrands = [...brands, ...brands];

  return (
    <section className="brand-section" id="brands">
      <div className="brand-track">
        <div className="brand-slider">
          {allBrands.map((brand, i) => (
            <div key={i} className="brand-item">
              <span className="brand-icon">{brand.icon}</span>
              <span className="brand-name">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
