// client/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from './components/ui/Loader';
import LandingPage from './pages/LandingPage'; 

// Placeholders for now
const Dashboard = () => <div className="text-white p-10 font-serif text-4xl">Dashboard</div>;
const Login = () => <div className="text-white p-10 font-serif text-4xl">Login</div>;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) setIsAuthenticated(true);
      setTimeout(() => setLoading(false), 2000);
    };
    checkAuth();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}