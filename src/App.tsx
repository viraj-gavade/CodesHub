import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CodesPage from './pages/CodesPage';
// import ResourcesPage from './pages/ResourcesPage';

import UploadPage from './pages/UploadPage';
import FoldersPage from './pages/FoldersPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<CodesPage />} />
            <Route path="/folders" element={<FoldersPage />} />

            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
