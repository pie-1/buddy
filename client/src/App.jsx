// client/src/App.jsx
import { useContext, Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
const Chat = lazy(() => import("./pages/Chat"));

const BOOT_MS = 2200;

function useBooted(ms) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
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
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const { loading } = useContext(AuthContext);
  const booted = useBooted(BOOT_MS);
  const showLoader = !booted || loading;

  return (
    <>
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

          {/* Marketplace: static routes BEFORE dynamic :id */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/marketplace/new"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route path="/marketplace/:id" element={<ListingDetail />} />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}