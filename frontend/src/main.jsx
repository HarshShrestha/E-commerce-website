import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "./context/ShopProvider";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>,
);
