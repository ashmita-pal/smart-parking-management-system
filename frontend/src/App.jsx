import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";
import PublicLayout from "./components/layout/PublicLayout";

import LandingPage from "./pages/auth/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EmailVerification from "./pages/auth/EmailVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminParkingLots from "./pages/admin/AdminParkingLots";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParkingSlots from "./pages/admin/AdminParkingSlots";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminUsers from "./pages/admin/AdminUsers";
import CheckIn from "./pages/admin/CheckIn";


import FindParking from "./pages/user/FindParking";
import ParkingSlotSelection from "./pages/user/ParkingSlotSelection";
import VehicleSelection from "./pages/user/SelectVehicle";
import BookingDuration from "./pages/user/BookingDuration";
import BookingSummary from "./pages/user/BookingSummary";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import ActiveParking from "./pages/user/ActiveParking";
import Checkout from "./pages/user/Checkout";
import Dashboard from "./pages/user/Dashboard";
import MyBookings from "./pages/user/MyBookings";
import MyVehicles from "./pages/user/MyVehicles";
import VehicleDetails from "./pages/user/VehicleDetails";
import Payments from "./pages/user/Payments";
import Profile from "./pages/user/Profile";
import BookingDetails from "./pages/user/BookingDetails";
import Payment from "./pages/user/Payment";
import AdminCheckOut from "./pages/admin/AdminCheckout";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/verify-email" element={<EmailVerification />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="parking-lots" element={<AdminParkingLots />} />
          <Route path="parking-slots" element={<AdminParkingSlots />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="admin-checkout" element={<AdminCheckOut/>}/>
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>

          <Route path="/dashboard" element={<Dashboard />}/>

          <Route path="/find-parking" element={<FindParking />}/>

          <Route path="/booking-details/:bookingId" element={<BookingDetails />}/>

          <Route path="/parking-slots" element={<ParkingSlotSelection/>}/>

          <Route path="/select-vehicle" element={<VehicleSelection/>}/>

          <Route path="/booking-details/:bookingId" element={<BookingDetails />} />

          <Route path="/booking-duration" element={<BookingDuration/>}/>

          <Route path="/booking-summary" element={<BookingSummary/>}/>

          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />}/>

          <Route path="/active-parking" element={<ActiveParking/>}/>

          <Route path="/checkout" element={<Checkout/>}/>

          <Route path="/my-bookings" element={<MyBookings/>}/>

          <Route path="/my-vehicles" element={<MyVehicles/>}/>

          <Route path="/vehicle-details" element={<VehicleDetails/>}/>

          <Route path="/payment/:bookingId" element={<Payment />} />

          <Route path="/payments" element={<Payments/>}/>

          <Route path="/profile" element={<Profile/>}/>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;