import { useEffect, useState, useContext } from "react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { fetchCollegeRequests, updateCollegeRequest, fetchAdminStats, fetchAllUsers, updateUserRole, deleteUser } from "../services/adminService";
import { fetchAdminClaims, verifyClaim, rejectClaim } from "../services/spotlightService";
import { FiCheck, FiX, FiShield, FiLoader, FiUsers, FiGlobe, FiActivity, FiTrash2, FiStar } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <FiActivity size={16} /> },
  { id: "domains", label: "Domain Requests", icon: <FiGlobe size={16} /> },
  { id: "users", label: "User Management", icon: <FiUsers size={16} /> },
  { id: "spotlight", label: "Spotlight", icon: <FiStar size={16} /> },
];

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchCollegeRequests(), fetchAllUsers(), fetchAdminClaims()])
      .then(([s, r, u, c]) => { 
        setStats(s); 
        setRequests(r); 
        setUsers(u); 
        setClaims(c || []); 
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDomainAction = async (id, status) => {
    await updateCollegeRequest(id, status);
    setRequests((prev) => prev.map(r => r._id === id ? { ...r, status } : r));
    if (status === "approved") setStats(s => ({ ...s, pendingRequests: s.pendingRequests - 1 }));
    setToast({ type: "success", message: `Domain ${status}.` });
  };

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    setUsers((prev) => prev.map(u => u._id === id ? { ...u, role } : u));
    setToast({ type: "success", message: "Role updated." });
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure? This will remove the user permanently.")) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter(u => u._id !== id));
    setToast({ type: "success", message: "User removed." });
  };

const handleVerifyClaim = async (id) => {
  try {
    await verifyClaim(id);
    setClaims(prev => prev.map(c => c._id === id ? { ...c, status: "verified" } : c));
    setToast({ type: "success", message: "Verified! +10 trust score awarded." });
    
    // Refresh stats so the number on the dashboard updates too
    const fresh = await fetchAdminStats();
    setStats(fresh);
  } catch (err) {
    setToast({ type: "error", message: err.response?.data?.message || "Failed to verify." });
  }
};

  const handleRejectClaim = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):");
    if (reason === null) return;
    try {
      await rejectClaim(id, reason);
      setClaims(prev => prev.map(c => c._id === id ? { ...c, status: "rejected" } : c));
      setToast({ type: "success", message: "Claim rejected." });
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "Failed to reject." });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />
      <div className="pt-32 flex justify-center"><FiLoader className="animate-spin text-indigo-500" size={32} /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl text-sm font-semibold shadow-lg ${
              toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

          <aside className="bg-white border border-stone-200 rounded-2xl p-4 h-fit lg:sticky lg:top-28 shadow-sm">
            <div className="flex items-center gap-3 px-3 pb-4 mb-4 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <FiShield size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-stone-900 truncate">{user.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">{user.role}</div>
              </div>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="min-w-0">
            <AnimatePresence mode="wait">

              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome back, {user.name.split(" ")[0]}</h1>
                  <p className="text-stone-500 mb-8">Here's the pulse of your platform.</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Users", value: stats.users, icon: <FiUsers />, color: "text-indigo-600 bg-indigo-50" },
                      { label: "Active Listings", value: stats.listings, icon: <FiActivity />, color: "text-orange-600 bg-orange-50" },
                      { label: "Upcoming Events", value: stats.events, icon: <FiActivity />, color: "text-emerald-600 bg-emerald-50" },
                      { label: "Pending Domains", value: stats.pendingRequests, icon: <FiGlobe />, color: "text-red-600 bg-red-50" },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                        <div className="text-3xl font-black text-stone-900">{s.value}</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mt-1">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "domains" && (
                <motion.div key="domains" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Domain Requests</h2>
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                        <tr>
                          <th className="px-6 py-4">Domain</th>
                          <th className="px-6 py-4">Requested By</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {requests.map((req) => (
                          <tr key={req._id} className="hover:bg-stone-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-stone-800">{req.domain}</td>
                            <td className="px-6 py-4 text-stone-600">{req.requestedBy?.name || "Guest"}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                req.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                                req.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                              }`}>{req.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              {req.status === "pending" && (
                                <>
                                  <button onClick={() => handleDomainAction(req._id, "approved")} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><FiCheck size={14} /></button>
                                  <button onClick={() => handleDomainAction(req._id, "rejected")} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><FiX size={14} /></button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                        {requests.length === 0 && <tr><td colSpan="4" className="text-center py-12 text-stone-500 text-sm">No domain requests found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">User Management</h2>
                  <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Trust</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-stone-50/50">
                            <td className="px-6 py-4">
                              <div className="font-bold text-stone-800">{u.name}</div>
                              <div className="text-xs text-stone-500">{u.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none ${
                                  u.role === "admin" ? "border-red-200 bg-red-50 text-red-700" :
                                  u.role === "moderator" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-stone-200 bg-stone-50 text-stone-700"
                                }`}>
                                <option value="student">Student</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 font-bold text-stone-700">{u.trustScore || 0}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "spotlight" && (
                <motion.div key="spotlight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-stone-900">Spotlight Management</h2>
                      <p className="text-stone-500 text-sm mt-1">Verify payments and manage active spotlights.</p>
                    </div>
                    <FiStar size={32} className="text-amber-400" />
                  </div>

                  {/* Pending Claims */}
                  <div className="mb-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-3 border-b border-stone-200 pb-2">Pending Claims</h3>
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                          <tr>
                            <th className="px-6 py-4">Target Type</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Proof</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {claims.filter(c => c.status === "pending").map((claim) => (
                            <tr key={claim._id} className="hover:bg-stone-50/50">
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  claim.targetType === "event" ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700"
                                }`}>
                                  {claim.targetType}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-stone-800">
                                  {claim.targetType === "event" ? claim.targetId?.title : claim.targetId?.name}
                                </div>
                                <div className="text-[10px] text-stone-400">By: {claim.userId?.name}</div>
                              </td>
                              <td className="px-6 py-4">
                                <a href={claim.screenshot} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">View Proof</a>
                                <div className="text-[10px] text-stone-400 mt-0.5">TXN: {claim.txnId}</div>
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => handleVerifyClaim(claim._id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg hover:bg-emerald-100">Approve</button>
                                <button onClick={() => handleRejectClaim(claim._id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg hover:bg-red-100">Reject</button>
                              </td>
                            </tr>
                          ))}
                          {claims.filter(c => c.status === "pending").length === 0 && (
                            <tr><td colSpan="4" className="text-center py-8 text-stone-500 text-sm">No pending claims.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* History */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-3 border-b border-stone-200 pb-2">Processed Claims</h3>
                    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                          <tr>
                            <th className="px-6 py-4">Target</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {claims.filter(c => c.status !== "pending").map((claim) => (
                            <tr key={claim._id}>
                              <td className="px-6 py-4 font-medium text-stone-700">
                                <span className="text-[10px] font-bold uppercase text-stone-400 mr-2">{claim.targetType}</span>
                                {claim.targetType === "event" ? claim.targetId?.title : claim.targetId?.name}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  claim.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                }`}>{claim.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}