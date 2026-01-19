import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import UserLayout from "./components/layout/UserLayout.jsx";
import UserRoute from "./components/common/UserRoute.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminRoute from "./components/common/AdminRoute.jsx";
import AuthLayout from "./components/layout/AuthLayout.jsx"; // IMPORT THIS

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopPage from "./pages/customer/ShopPage.jsx";
import ProductDetails from "./pages/customer/ProductDetails.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import ProfilePage from "./pages/customer/ProfilePage.jsx";
import CheckoutPage from "./pages/customer/CheckoutPage.jsx";
import OrdersPage from "./pages/customer/OrdersPage.jsx";
import OrdersDetailsPage from "./pages/customer/OrdersDetailsPage.jsx";
import CustomerDashboard from "./pages/customer/CustomerDashboard.jsx";
import ComingSoonPage from "./pages/ComingSoon.jsx";
import StoreDetailsPage from "./pages/customer/StoreDetailsPage.jsx";
import VerifyEmailPage from "./pages/VerifyPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import CheckEmail from "./pages/CheckEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Admin Pages... (Keep your imports)
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminStore from "./pages/admin/AdminStore.jsx";
import CreateStoreForm from "./pages/admin/CreateStoreForm.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

function App() {
  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>

        {/* --- 1. AUTHENTICATION (Blurred Background, Centered) --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* --- 2. MAIN APP (Navbar + Footer + Top Aligned Content) --- */}
        <Route element={<UserLayout />}>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/store/:id" element={<StoreDetailsPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

          {/* Protected Customer Routes */}
          <Route path="/customer" element={<UserRoute />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrdersDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

        </Route>

        {/* --- 3. ADMIN --- */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="store" element={<AdminStore />} />
          <Route path="store/create" element={<CreateStoreForm />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<ProductForm mode="add" />} />
          <Route path="products/edit/:id" element={<ProductForm mode="edit" />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<h1>404 Page Not Found</h1>} />

      </Routes>
    </div>
  );
}

export default App;