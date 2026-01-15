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

function App(){
  return (
    <div className="app">
      {/* this componentwill listen all toast calls and return them */}
      <Toaster position="top-center" reverseOrder={false}/>

      <Routes>

        {/* Home Page we will create this in last landing page --- this for guests */}
        <Route path="/" element={ <Home /> } />

        {/* Auth Pages */}
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />

        {/* Admin Dashboard  */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout/>
          </AdminRoute>
          }>
            {/* these are child routes that go in the < Outlet/> */}
            <Route index element={<AdminDashboard/>} />  {/* as /admin */}
            <Route path="store" element={<AdminStore/>} />  {/* as /admin/store */}
            <Route path="store/create" element={<CreateStoreForm />} />

            <Route path="products" element={< AdminProducts />} />
            <Route path="products/add" element={< ProductForm mode="add" />} />
            <Route path="products/edit/:id" element={< ProductForm mode="edit" />} />

            <Route path="analytics" element={<AdminAnalytics/>} />
            <Route path="profile" element={<AdminProfile/>} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={
          <UserRoute>
            <UserLayout/>
          </UserRoute>
        } >
          {/* Children of customer routes  */}

        </Route>
        
        {/* The '*' path acts as a 404 Page Not Found */}
       <Route path="*" element={ <h1>404 Page Not Found</h1> } /> 
      </Routes>
    </div>
  )
}

export default App;