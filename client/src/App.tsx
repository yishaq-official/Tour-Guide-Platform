import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { HeritageDetail } from './pages/HeritageDetail';
import { CultureDetail } from './pages/CultureDetail';
import { TransportInfo } from './pages/TransportInfo';
import { Services } from './pages/Services';
import { Essentials } from './pages/Essentials';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/heritage/:id" element={<HeritageDetail />} />
          <Route path="explore/culture/:id" element={<CultureDetail />} />
          <Route path="transport" element={<TransportInfo />} />
          <Route path="services" element={<Services />} />
          <Route path="essentials" element={<Essentials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
