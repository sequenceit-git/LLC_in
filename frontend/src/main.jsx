import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import ArticlePage from './pages/ArticlePage';
import PolicyPage from './pages/PolicyPage';
import AdminPage from './pages/AdminPage';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:slug" element={<ArticlePage />} />

            {/* Resource Column Pages / Legal & Statements */}
            <Route path="/privacy-policy" element={<PolicyPage slug="privacy-policy" />} />
            <Route path="/terms-of-use" element={<PolicyPage slug="terms-of-use" />} />
            <Route path="/refund-cancellation-policy" element={<PolicyPage slug="refund-cancellation-policy" />} />
            <Route path="/accessibility-statement" element={<PolicyPage slug="accessibility-statement" />} />
            <Route path="/sitemap" element={<PolicyPage slug="sitemap" />} />
            <Route path="/policy/:slug" element={<PolicyPage />} />

            <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
            <Route path="/admin/:tab" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
