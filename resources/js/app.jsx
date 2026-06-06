import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import LoginPage         from './components/LoginPage';
import ETourneyDashboard from './components/ETourneyDashboard';
import TournamentsPage   from './components/TournamentsPage';
import TeamsPage         from './components/TeamsPage';
import PaymentsPage      from './components/PaymentsPage';
import UsersPage         from './components/UsersPage';
import SettingsPage      from './components/SettingsPage';
import UserDashboardPage from './components/UserDashboardPage';

// Set axios default
axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem('auth_token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const getUser  = () => JSON.parse(localStorage.getItem('auth_user') || 'null');
const getRole  = () => getUser()?.role ?? null;
const isLogged = () => !!localStorage.getItem('auth_token');

// ── Route Guards ──────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) =>
  isLogged() ? children : <Navigate to="/login" replace />;

const AdminRoute = ({ children }) => {
  if (!isLogged()) return <Navigate to="/login" replace />;
  if (getRole() === 'peserta') return <Navigate to="/home" replace />;
  return children;
};

const RootRedirect = () => {
  if (!isLogged()) return <Navigate to="/login" replace />;
  return getRole() === 'peserta'
    ? <Navigate to="/home" replace />
    : <Navigate to="/dashboard" replace />;
};

// ── App ───────────────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Admin & Panitia */}
        <Route path="/dashboard"   element={<AdminRoute><ETourneyDashboard /></AdminRoute>} />
        <Route path="/tournaments" element={<AdminRoute><TournamentsPage /></AdminRoute>} />
        <Route path="/teams"       element={<AdminRoute><TeamsPage /></AdminRoute>} />
        <Route path="/payments"    element={<AdminRoute><PaymentsPage /></AdminRoute>} />
        <Route path="/users"       element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path="/settings"    element={<AdminRoute><SettingsPage /></AdminRoute>} />

        {/* Peserta */}
        <Route path="/home" element={<PrivateRoute><UserDashboardPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);