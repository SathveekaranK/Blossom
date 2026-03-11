import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Checkout from './pages/Checkout.tsx';
import MyOrders from './pages/MyOrders.tsx';
import Navbar from './components/Navbar.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import DashboardHome from './pages/admin/DashboardHome.tsx';
import CategoriesAdmin from './pages/admin/CategoriesAdmin.tsx';
import ProductsAdmin from './pages/admin/ProductsAdmin.tsx';
import OrdersAdmin from './pages/admin/OrdersAdmin.tsx';
import UsersAdmin from './pages/admin/UsersAdmin.tsx';
import ProductAnalysis from './pages/admin/ProductAnalysis.tsx';
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
import api from './api/api';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { items, setItems } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Sync local cart to DB
      const currentItems = items.map(i => ({ productId: i.id, quantity: i.quantity }));
      api.post('/cart/sync', { items: currentItems })
        .then(res => {
          if (res.data?.items) {
             const syncedItems = res.data.items.map((cartItem: any) => ({
                 id: cartItem.product.id,
                 name: cartItem.product.name,
                 price: Number(cartItem.product.price),
                 quantity: cartItem.quantity,
                 imageUrl: cartItem.product.imageUrl,
                 slug: cartItem.product.slug,
                 stock: cartItem.product.stock
             }));
             setItems(syncedItems);
          }
        })
        .catch(err => console.error('Failed to sync cart:', err));
    }
  }, [isAuthenticated]);

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

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="analysis" element={<ProductAnalysis />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="orders" element={<OrdersAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
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
