import { useRef } from "react";
import { useShop } from "../hooks/useShop";
import { useLandingMotion } from "../hooks/useLandingMotion";
import HomeHero from "../components/HomeHero";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import CatalogState from "../components/CatalogState";
import OurPolicy from "../components/OurPolicy";
import Newsletter from "../components/Newsletter";
export default function Home() {
  const { products, loading, error } = useShop();
  const scope = useRef(null);
  useLandingMotion(scope, products);
  const latest = products.slice(-10);
  const bestsellers = products
    .filter((product) => product.bestSeller)
    .slice(0, 5);
  return (
    <div className="landing-page shell" ref={scope}>
      <HomeHero />
      <section className="home-collection" aria-label="Latest collections">
        <div className="home-section-heading" data-reveal>
          <SectionTitle first="LATEST" second="COLLECTIONS" />
          <p>
            Explore our latest collection of products, featuring the newest
            trends and styles.
          </p>
        </div>
        <CatalogState />
        {!loading && !error && (
          <div className="product-grid home-grid">
            {latest.map((product, index) => (
              <div
                className="reveal-card"
                key={product._id}
                data-reveal
                data-delay={(index % 5) * 45}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
      <section
        className="home-collection bestsellers"
        aria-label="Best sellers"
      >
        <div className="home-section-heading" data-reveal>
          <SectionTitle first="BEST" second="SELLERS" />
          <p>
            Discover our best-selling products, loved for their everyday style.
          </p>
        </div>
        {!loading && !error && (
          <div className="product-grid home-grid">
            {bestsellers.map((product, index) => (
              <div
                className="reveal-card"
                key={product._id}
                data-reveal
                data-delay={index * 45}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
      <OurPolicy />
      <div data-reveal>
        <Newsletter />
      </div>
    </div>
  );
}
