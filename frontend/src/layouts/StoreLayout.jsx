import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import AppRoutes from "../routes/AppRoutes";
import { useScrollToTop } from "../hooks/useScrollToTop";
export default function StoreLayout() {
  useScrollToTop();
  return (
    <>
      <Header />
      <main id="main">
        <AppRoutes />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
