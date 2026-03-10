import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Checkout from './pages/Checkout.tsx';
import Navbar from './components/Navbar.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import DashboardHome from './pages/admin/DashboardHome.tsx';
import CategoriesAdmin from './pages/admin/CategoriesAdmin.tsx';
import ProductsAdmin from './pages/admin/ProductsAdmin.tsx';
import OrdersAdmin from './pages/admin/OrdersAdmin.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import About from './pages/About.tsx';
import Wishlist from './pages/Wishlist.tsx';
import Footer from './components/Footer.tsx';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { useEffect } from 'react';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-light selection:bg-primary/30">
        <Navbar />
        <main className="pt-28 md:pt-32">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
            />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="orders" element={<OrdersAdmin />} />
                <Route path="users" element={<div className="p-10 text-2xl font-black text-dark/10 uppercase tracking-widest">Users Admin</div>} />
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
