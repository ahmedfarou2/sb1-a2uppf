import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/Dashboard';
import UserSettings from './components/settings/UserSettings';
import OrganizationSetup from './components/organization/OrganizationSetup';
import JoinOrganization from './components/organization/JoinOrganization';
import OrganizationChoice from './components/organization/OrganizationChoice';
import PendingVerifications from './components/admin/PendingVerifications';
import RegisteredAuditFirms from './components/admin/RegisteredAuditFirms';
import UsersManagement from './components/admin/UsersManagement';
import { useAppearanceStore } from './stores/appearanceStore';

function App() {
  const [isArabic, setIsArabic] = useState(false);
  const { isDarkMode } = useAppearanceStore();

  return (
    <BrowserRouter>
      <AuthProvider>
        <div dir={isArabic ? 'rtl' : 'ltr'} className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
          <Navbar isArabic={isArabic} onLanguageToggle={() => setIsArabic(!isArabic)} />
          <Routes>
            <Route path="/" element={
              <>
                <Hero isArabic={isArabic} />
                <Features isArabic={isArabic} />
              </>
            } />
            <Route path="/login" element={<Login isArabic={isArabic} />} />
            <Route path="/register" element={<Register isArabic={isArabic} />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <UserSettings isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/organization-choice" element={
              <ProtectedRoute>
                <OrganizationChoice isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/organization-setup" element={
              <ProtectedRoute>
                <OrganizationSetup isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/join-organization" element={
              <ProtectedRoute>
                <JoinOrganization isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/admin/verifications" element={
              <ProtectedRoute>
                <PendingVerifications isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/admin/firms" element={
              <ProtectedRoute>
                <RegisteredAuditFirms isArabic={isArabic} />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <UsersManagement isArabic={isArabic} />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer isArabic={isArabic} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;