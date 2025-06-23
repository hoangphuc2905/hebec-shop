import { Outlet } from "react-router-dom";
import Header from "../components/layout/client/Header";
import Footer from "../components/layout/client/Footer";

function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;
