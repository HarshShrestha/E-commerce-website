import { Link } from "react-router-dom";
import { heroImage } from "../services/editorial-images.js";
export default function HomeHero() {
  return (
    <section className="original-hero" aria-label="Latest arrivals">
      <div className="hero-copy">
        <div>
          <p className="hero-kicker" data-reveal>
            OUR BESTSELLER
          </p>
          <h1 data-reveal>Latest Arrivals</h1>
          <Link className="hero-shop" to="/collection" data-reveal>
            SHOP NOW
            <span aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img
          src={heroImage}
          alt="Latest arrivals — fashion portrait against a soft pink background"
          fetchPriority="high"
          width="1257"
          height="1008"
        />
      </div>
    </section>
  );
}
