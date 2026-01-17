import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register";
import {Toaster} from "react-hot-toast"
import AdminRoute from "./components/common/AdminRoute"
import AdminLayout from "./components/layout/AdminLayout.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminStore from "./pages/admin/AdminStore.jsx";
import CreateStoreForm from "./pages/admin/CreateStoreForm.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import UserLayout from "./components/layout/UserLayout.jsx";
import UserRoute from "./components/common/UserRoute.jsx"
import CartPage from "./pages/customer/CartPage.jsx";
import CheckoutPage from "./pages/customer/CheckoutPage.jsx";
import OrdersPage from "./pages/customer/OrdersPage.jsx";
import OrdersDetailsPage from "./pages/customer/OrdersDetailsPage.jsx";

// NEW: Import the ShopPage (Make sure this file exists in pages/customer/ShopPage.jsx)
import ShopPage from "./pages/customer/ShopPage.jsx";

function App(){
  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false}/>

      <Routes>
        {/* --- PUBLIC GUEST ROUTES --- */}
        {/* These don't have a Layout yet in your version, which is fine! */}
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        
        {/* NEW: Shop page and cart page is also public for guests */}
        <Route path="/shop" element={ <ShopPage /> } />
        <Route path="/cart" element={ <CartPage /> } />

        {/* --- ADMIN DASHBOARD --- */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout/>
          </AdminRoute>
          }>
            <Route index element={<AdminDashboard/>} />
            <Route path="store" element={<AdminStore/>} />
            <Route path="store/create" element={<CreateStoreForm />} />
            <Route path="products" element={< AdminProducts />} />
            <Route path="products/add" element={< ProductForm mode="add" />} />
            <Route path="products/edit/:id" element={< ProductForm mode="edit" />} />
            <Route path="analytics" element={<AdminAnalytics/>} />
            <Route path="profile" element={<AdminProfile/>} />
        </Route>

        {/* --- CUSTOMER PROTECTED ROUTES --- */}
        <Route path="/customer" element={
          <UserRoute>
            <UserLayout/>
          </UserRoute>
        } >
          {/* Children of customer routes render inside UserLayout's <Outlet/> */}
          <Route path="profile" element={<h1>Customer Profile</h1>} />
          <Route path="orders" element={<OrdersPage/>} />
          <Route path="orders/:id" element={<OrdersDetailsPage/>} />
          <Route path="checkout" element={<CheckoutPage/>} />

        </Route>
        
       <Route path="*" element={ <h1>404 Page Not Found</h1> } /> 
      </Routes>
    </div>
  )
}

export default App;