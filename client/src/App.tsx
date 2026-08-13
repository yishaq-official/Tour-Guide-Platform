import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="heritages" element={<div className="p-20 text-center text-2xl font-bold text-gray-700">Heritages Page (Coming Soon)</div>} />
          <Route path="services" element={<div className="p-20 text-center text-2xl font-bold text-gray-700">Services Page (Coming Soon)</div>} />
          <Route path="essentials" element={<div className="p-20 text-center text-2xl font-bold text-gray-700">Essentials Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
