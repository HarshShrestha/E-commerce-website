import { uploadedImage } from "../services/editorial-images.js";
import exchange from "../assets/exchange_icon.png";
import quality from "../assets/quality_icon.png";
import support from "../assets/support_img.png";
export default function OurPolicy() {
  return (
    <section className="our-policy" aria-label="Shopping with Forever">
      {[
        [
          exchange,
          "Exchange information",
          "Check the merchant’s exchange terms before placing your order.",
        ],
        [
          quality,
          "Thoughtfully selected",
          "Explore everyday styles for women, men and kids.",
        ],
        [
          support,
          "Here to help",
          "Find shopping answers and order updates in our help section.",
        ],
      ].map(([image, title, text]) => (
        <div key={title} data-reveal>
          <img
            src={uploadedImage(
              image === exchange
                ? "exchange_icon.png"
                : image === quality
                  ? "quality_icon.png"
                  : "support_img.png",
              image,
            )}
            alt=""
            width="48"
            height="48"
            loading="lazy"
          />
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </section>
  );
}
