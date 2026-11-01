import { aboutImage } from "../services/editorial-images.js";
import SectionTitle from "../components/SectionTitle.jsx";
import Newsletter from "../components/Newsletter.jsx";
export default function About() {
  return (
    <section className="shell section original-about">
      <div className="centered-page-title">
        <SectionTitle first="ABOUT" second="US" />
      </div>
      <div className="story-layout">
        <img
          src={aboutImage}
          alt="A selection of Forever wardrobe essentials"
        />
        <div>
          <p>
            Forever brings together clothing for women, men and kids in one
            uncomplicated place. From relaxed tops to easy layers, our
            collection is about finding the pieces that fit into your everyday.
          </p>
          <p>
            Explore the collection at your own pace, discover new arrivals and
            choose the sizes and styles that feel like you.
          </p>
          <h3>Our mission</h3>
          <p>
            Make everyday shopping straightforward, with clear product details,
            an easy-to-use bag and order updates in your account.
          </p>
        </div>
      </div>
      <div className="choose-title">
        <SectionTitle first="WHY" second="CHOOSE US" />
      </div>
      <div className="choose-grid">
        {[
          [
            "A considered collection",
            "Discover clothing for women, men and kids, with sizes and details on every product page.",
          ],
          [
            "Everyday convenience",
            "Save your favorites, keep your bag between visits and review everything before checkout.",
          ],
          [
            "Order updates",
            "Sign in to find your order history and refresh the latest fulfillment status from the store.",
          ],
        ].map(([title, text]) => (
          <div key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <Newsletter />
    </section>
  );
}
