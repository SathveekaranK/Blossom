import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import { useWishlistStore } from './store/useWishlistStore';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Checkout from './pages/Checkout.tsx';
import MyOrders from './pages/MyOrders.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import DashboardHome from './pages/admin/DashboardHome.tsx';
import CategoriesAdmin from './pages/admin/CategoriesAdmin.tsx';
import ProductsAdmin from './pages/admin/ProductsAdmin.tsx';
import OrdersAdmin from './pages/admin/OrdersAdmin.tsx';
import UsersAdmin from './pages/admin/UsersAdmin.tsx';
import ProductAnalysis from './pages/admin/ProductAnalysis.tsx';
import SettingsAdmin from './pages/admin/SettingsAdmin.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import About from './pages/About.tsx';
import Wishlist from './pages/Wishlist.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import UserLayout from './components/UserLayout.tsx';
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { items, setItems } = useCartStore();
  const { fetchWishlist, clearWishlist } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch Wishlist
      fetchWishlist();

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
    } else {
      clearWishlist();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>
        </Route>

        {/* Admin Routes (Unprotected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="analysis" element={<ProductAnalysis />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
