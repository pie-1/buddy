import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchProfileById } from "../services/userService";
import { startConversation } from "../services/chatService";
import ProfileIdentityCard from "../components/features/Profile/ProfileIdentityCard";
import ProfileStudentContent from "../components/features/Profile/ProfileStudentContent";
import ProfileAdminContent from "../components/features/Profile/ProfileAdminContent";
import ProfileSidebar from "../components/features/Profile/ProfileSidebar";

const EASE = [0.22, 1, 0.36, 1];

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchProfileById(id);
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleMessage = async () => {
    setMessaging(true);
    try {
      const convo = await startConversation({
        recipientId: data.user._id,
        contextType: "profile",
        contextId: data.user._id,
      });
      navigate(`/chat/${convo._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not open chat");
      setMessaging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <FiLoader className="animate-spin text-orange-500" size={32} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-32 px-6 text-center">
          <FiAlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2 text-stone-900">Profile not found</h1>
          <p className="text-stone-500 mb-8">{error || "This profile may not exist."}</p>
          <a href="/" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  const { user, listings, roommate, events, teamRequests, helpPosts, mutual, spotlight, commonGround, adminStats } = data;
  const isOwn = me._id === user._id;
  const isAdminOrMod = user.role === "admin" || user.role === "moderator";

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-32 pb-24 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:sticky lg:top-32 self-start"
          >
            <ProfileIdentityCard
              user={user}
              spotlight={spotlight}
              isOwn={isOwn}
              isAdminOrMod={isAdminOrMod}
              mutual={mutual}
              commonGround={commonGround}
              messaging={messaging}
              onMessage={handleMessage}
            />
            <div className="mt-6">
              <ProfileSidebar
                user={user}
                spotlight={spotlight}
                isOwn={isOwn}
                isAdminOrMod={isAdminOrMod}
              />
            </div>
          </motion.div>

          <motion.main
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="min-w-0"
          >
            {isAdminOrMod ? (
              <ProfileAdminContent user={user} adminStats={adminStats} isOwn={isOwn} />
            ) : (
              <ProfileStudentContent
                user={user}
                listings={listings}
                roommate={roommate}
                events={events}
                teamRequests={teamRequests}
                helpPosts={helpPosts}
                isOwn={isOwn}
              />
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
}