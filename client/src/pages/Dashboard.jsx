// client/src/pages/Dashboard.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // If the user is an admin, show the Admin Dashboard
  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto pt-32 px-6">
          <h1 className="text-4xl font-serif font-bold mb-2">Admin Control Panel</h1>
          <p className="text-red-400 mb-8">Restricted Access • {user.university} Node</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Verification Queue</h3>
              <p className="text-gray-400 text-sm mb-4">Approve new student domains.</p>
              <div className="text-3xl font-black text-white">0</div>
            </div>
            <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Spotlight Claims</h3>
              <p className="text-gray-400 text-sm mb-4">Pending eSewa verifications.</p>
              <div className="text-3xl font-black text-white">0</div>
            </div>
            <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Moderation</h3>
              <p className="text-gray-400 text-sm mb-4">Reported listings and chats.</p>
              <div className="text-3xl font-black text-white">0</div>
            </div>
            <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Disputes</h3>
              <p className="text-gray-400 text-sm mb-4">Unresolved transactions.</p>
              <div className="text-3xl font-black text-white">0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the Student Dashboard
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-32 px-6">
        
        <div className="flex items-end justify-between border-b border-white/10 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Welcome back, {user.name}</h1>
            <p className="text-gray-400">
              {user.university} Node • {user.isAlumni ? "Alumni Network" : "Current Student"}
            </p>
          </div>
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm font-bold">
            Trust Score: {user.trustScore || 0}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-between">
            <h3 className="text-xl font-bold">Marketplace</h3>
            <p className="text-gray-400 text-sm">Your active listings and requests will appear here.</p>
            <button className="bg-indigo-600 w-full py-2 rounded-lg font-bold">Browse Items</button>
          </div>
          <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-between">
            <h3 className="text-xl font-bold">Roommates</h3>
            <p className="text-gray-400 text-sm">Find verified flatmates or list your room.</p>
            <button className="bg-white/5 border border-white/10 w-full py-2 rounded-lg font-bold">View Posts</button>
          </div>
          <div className="bg-[#14121f] border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-between">
            <h3 className="text-xl font-bold">Campus Radar</h3>
            <p className="text-gray-400 text-sm">Upcoming events, hackathons, and fests.</p>
            <button className="bg-white/5 border border-white/10 w-full py-2 rounded-lg font-bold">Explore Events</button>
          </div>
        </div>
      </div>
    </div>
  );
}