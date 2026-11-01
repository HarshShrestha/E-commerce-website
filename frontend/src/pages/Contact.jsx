import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Newsletter from "../components/Newsletter.jsx";
import contact from "../assets/contact_img.png";
import { uploadedImage } from "../services/editorial-images.js";
function Contact() {
  return (
    <section className="shell section">
      <div className="centered-page-title">
        <SectionTitle first="CONTACT" second="US" />
      </div>
      <div className="contact-intro">
        <img
          src={uploadedImage("contact_img.png", contact)}
          alt="Forever workspace with a laptop and everyday essentials"
        />
        <div>
          <h2>Our store</h2>
          <p>
            Find the latest styles, check your order status or get answers to
            your shopping questions.
          </p>
          <p>
            Merchant contact details, delivery regions and return terms must be
            configured before launch. No live support address has been set for
            this demo.
          </p>
          <Link className="button outline" to="/orders">
            View your orders <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <div className="faq-layout">
        <div>
          <h2>Shopping help</h2>
          <p>Quick answers before you check out.</p>
        </div>
        <div>
          {[
            [
              "How much is shipping?",
              "Shipping is $10, or free when your item subtotal reaches $150.",
            ],
            [
              "How can I pay?",
              "Cash on delivery is currently the only supported payment method. Online payments are not enabled.",
            ],
            [
              "Where is my order?",
              "Sign in, open Your orders and select Refresh status to see the latest update from the store.",
            ],
            [
              "Can I change or return my order?",
              "Contact the merchant before returning an item. Return eligibility, timelines and delivery regions need to be published by the merchant before launch.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
      <Newsletter />
    </section>
  );
}
export default Contact;
