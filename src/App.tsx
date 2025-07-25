import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './components/AppProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { NotFound } from './pages/NotFound';
import './index.css';
import React, { Suspense } from 'react';
import TagPage from './pages/TagPage';

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const PCLazy = React.lazy(() => import('./pages/PC'));

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pc" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>}>
                <PCLazy />
              </Suspense>
            } />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/:tag" element={<TagPage />} />
            {/* Redirect old/alternative routes */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            {/* 404 Not Found - This should be the last route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
