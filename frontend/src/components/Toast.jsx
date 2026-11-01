import { useShop } from "../hooks/useShop";
import Icon from "./Icon";
export default function Toast() {
  const { notice, setNotice } = useShop();
  return (
    <div
      className={notice ? "toast visible" : "toast"}
      role="status"
      aria-live="polite"
    >
      {notice && (
        <>
          <Icon name="check" />
          <span>{notice}</span>
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <Icon name="close" />
          </button>
        </>
      )}
    </div>
  );
}
