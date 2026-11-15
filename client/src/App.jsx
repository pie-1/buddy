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
const Roommates = lazy(() => import("./pages/Roommates"));
const CreateRoommate = lazy(() => import("./pages/CreateRoommate"));
const RoommateDetail = lazy(() => import("./pages/RoommateDetail"));
const EditRoommate = lazy(() => import("./pages/EditRoommate"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const TeamRequestDetail = lazy(() => import("./pages/TeamRequestDetail"));
const CreateTeamRequest = lazy(() => import("./pages/CreateTeamRequest"));
const EditTeamRequest = lazy(() => import("./pages/EditTeamRequest"));
const ProfileView = lazy(() => import("./pages/ProfileView"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const Connect = lazy(() => import("./pages/Connect"));
const HelpFeed = lazy(() => import("./pages/HelpFeed"));
const CreateHelpPost = lazy(() => import("./pages/CreateHelpPost"));
const HelpDetail = lazy(() => import("./pages/HelpDetail"));

const BOOT_MS = 2200;

function useBooted(ms) {
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("cb:booted") === "1") { setBooted(true); return; }
    } catch { /* ignore */ }
    const timer = setTimeout(() => {
      try { sessionStorage.setItem("cb:booted", "1"); } catch { /* ignore */ }
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

// Redirect /profile/me → /profile/:ownId
function ProfileMeRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <Navigate to={`/profile/${user._id}`} replace />;
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

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Marketplace */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/new" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/marketplace/:id" element={<ListingDetail />} />

          {/* Chat */}
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* Roommates */}
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/roommates/new" element={<ProtectedRoute><CreateRoommate /></ProtectedRoute>} />
          <Route path="/roommates/:id/edit" element={<ProtectedRoute><EditRoommate /></ProtectedRoute>} />
          <Route path="/roommates/:id" element={<RoommateDetail />} />

          {/* Events */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/new" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/events/:id/team/new" element={<ProtectedRoute><CreateTeamRequest /></ProtectedRoute>} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* Team requests */}
          <Route path="/team-requests/:id/edit" element={<ProtectedRoute><EditTeamRequest /></ProtectedRoute>} />
          <Route path="/team-requests/:id" element={<TeamRequestDetail />} />

          {/* Profile: static routes BEFORE dynamic :id */}
          <Route path="/connect" element={<ProtectedRoute><Connect /></ProtectedRoute>} />
          <Route path="/profile/me" element={<ProfileMeRedirect />} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />

          <Route path="/help" element={<ProtectedRoute><HelpFeed /></ProtectedRoute>} />
          <Route path="/help/new" element={<ProtectedRoute><CreateHelpPost /></ProtectedRoute>} />
          <Route path="/help/:id" element={<ProtectedRoute><HelpDetail /></ProtectedRoute>} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}