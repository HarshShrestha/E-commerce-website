import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
function Empty({
  title = "Nothing here just yet.",
  text = "Explore the collection and find something you love.",
}) {
  return (
    <section className="empty shell">
      <Icon name="bag" width="40" height="40" />
      <h1>{title}</h1>
      <p>{text}</p>
      <Link to="/collection" className="button">
        Explore collection <Icon name="arrow" />
      </Link>
    </section>
  );
}
export default Empty;
