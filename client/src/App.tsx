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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
