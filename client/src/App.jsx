// client/src/App.jsx
import { useContext, Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "./context/AuthContext";
import { Loader } from "./components/ui/Loader";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ListingDetail = lazy(() => import("./pages/ListingDetail")); 
const CreateListing = lazy(() => import("./pages/CreateListing"));


const BOOT_MS = 2200; // Long enough to see the scan animation loop once

function useBooted(ms) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Skip boot loader if already booted in this session
    try {
      if (sessionStorage.getItem("cb:booted") === "1") {
        setBooted(true);
        return;
      }
    } catch { /* ignore */ }

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem("cb:booted", "1");
      } catch { /* ignore */ }
      setBooted(true);
    }, ms);

    return () => clearTimeout(timer);
  }, [ms]);

  return booted;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // Loader is on screen
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const { loading } = useContext(AuthContext);
  const booted = useBooted(BOOT_MS);
  const showLoader = !booted || loading;

  return (
    <>
      {/* Loader with graceful fade out */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <Loader fullScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main routes — always mounted but hidden behind the loader */}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ListingDetail />} />
          <Route path="/marketplace/new" element={<CreateListing />} />
  


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}