import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public/User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

//  New Buyer Pages
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

// Vendor files
import VendorLayout from "./pages/VendorLayout";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import VendorProfile from "./pages/VendorProfile";
import VendorOnboard from "./pages/VendorOnboard";
import AddProduct from "./pages/AddProduct";


// vendor access guard
import VendorProtectedRoute from "./components/VendorProtectedRoute";

// Admin files
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVendorList from "./pages/AdminVendorList";
import AdminCategories from "./pages/AdminCategories";
import AdminProductList from "./pages/AdminProductList";
import AdminOrderList from "./pages/AdminOrderList";

//cart
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"; 

//order
import Orders from "./pages/Orders";

import Payment from "./pages/Payment";

import Wishlist from "./pages/Wishlist";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />

        <Route path="/orders" element={<Orders />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor"
            element={
              <ProtectedRoute>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="onboard" element={<VendorOnboard />} />
            <Route path="profile" element={<VendorProfile />} />

            <Route
              index
              element={
                <VendorProtectedRoute>
                  <VendorDashboard />
                </VendorProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <VendorProtectedRoute>
                  <VendorProducts />
                </VendorProtectedRoute>
              }
            />
            <Route
              path="products/add"
              element={
                <VendorProtectedRoute>
                  <AddProduct />
                </VendorProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <VendorProtectedRoute>
                  <VendorOrders />
                </VendorProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<AdminVendorList />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="orders" element={<AdminOrderList />} />

          </Route>

          <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        </Routes>

        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      </Router>
    </AuthProvider>
  );
}

export default App;
