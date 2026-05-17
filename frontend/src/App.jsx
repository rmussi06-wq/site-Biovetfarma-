import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}
