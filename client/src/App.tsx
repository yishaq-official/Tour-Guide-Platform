import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { HeritageDetail } from './pages/HeritageDetail';
import { CultureDetail } from './pages/CultureDetail';
import { TransportInfo } from './pages/TransportInfo';
import { Services } from './pages/Services';
import { HotelDetail } from './pages/HotelDetail';
import { VehicleDetail } from './pages/VehicleDetail';
import { Essentials } from './pages/Essentials';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { MyTrips } from './pages/MyTrips';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AdminDashboard } from './pages/AdminDashboard';
import { PartnerRoute } from './components/PartnerRoute';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { PartnerLanding } from './pages/PartnerLanding';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main Website Route Group with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="explore/heritage/:id" element={<HeritageDetail />} />
            <Route path="explore/culture/:id" element={<CultureDetail />} />
            <Route path="transport" element={<TransportInfo />} />
            <Route path="services" element={<Services />} />
            <Route path="services/hotel/:id" element={<HotelDetail />} />
            <Route path="services/vehicle/:id" element={<VehicleDetail />} />
            <Route path="essentials" element={<Essentials />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="my-trips" element={<MyTrips />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Dedicated Partner Portal Route Group */}
          <Route path="/partner">
            <Route index element={<PartnerLanding />} />
            <Route element={<PartnerRoute />}>
              <Route path="dashboard" element={<PartnerDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
