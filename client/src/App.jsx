// client/src/App.jsx
import { useContext, Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "./context/AuthContext";
import { Loader } from "./components/ui/Loader";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
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
const Spotlight = lazy(() => import("./pages/Spotlight"));
const SpotlightClaim = lazy(() => import("./pages/SpotlightClaim"));
const AdminSpotlight = lazy(() => import("./pages/AdminSpotlight"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));


function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function ProfileMeRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <Navigate to={`/profile/${user._id}`} replace />;
}

export default function App() {
  const { loading } = useContext(AuthContext);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Force the loader to stay for at least 2.8 seconds so the animation plays fully
    const timer = setTimeout(() => setMinTimePassed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const showLoader = loading || !minTimePassed;

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <Loader fullScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={<div className="min-h-screen bg-[#fafaf8]" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/auth" element={<AuthPage />} />
         
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/new" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/marketplace/:id" element={<ListingDetail />} />

          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          <Route path="/roommates" element={<Roommates />} />
          <Route path="/roommates/new" element={<ProtectedRoute><CreateRoommate /></ProtectedRoute>} />
          <Route path="/roommates/:id/edit" element={<ProtectedRoute><EditRoommate /></ProtectedRoute>} />
          <Route path="/roommates/:id" element={<RoommateDetail />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/new" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/events/:id/team/new" element={<ProtectedRoute><CreateTeamRequest /></ProtectedRoute>} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/team-requests/:id/edit" element={<ProtectedRoute><EditTeamRequest /></ProtectedRoute>} />
          <Route path="/team-requests/:id" element={<TeamRequestDetail />} />

          <Route path="/connect" element={<ProtectedRoute><Connect /></ProtectedRoute>} />
          <Route path="/profile/me" element={<ProfileMeRedirect />} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />

          <Route path="/help" element={<ProtectedRoute><HelpFeed /></ProtectedRoute>} />
          <Route path="/help/new" element={<ProtectedRoute><CreateHelpPost /></ProtectedRoute>} />
          <Route path="/help/:id" element={<ProtectedRoute><HelpDetail /></ProtectedRoute>} />

          <Route path="/spotlight" element={<Spotlight />} />
          <Route path="/spotlight/claim" element={<ProtectedRoute><SpotlightClaim /></ProtectedRoute>} />
          <Route path="/dashboard/spotlight" element={<ProtectedRoute><AdminSpotlight /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}