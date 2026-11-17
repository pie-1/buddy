// client/src/components/features/Profile/ProfileStudentContent.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin, FiCalendar, FiArrowUpRight, FiStar, FiBriefcase,
} from "react-icons/fi";
import ProfileTabs from "./ProfileTabs";
import { FiHelpCircle } from "react-icons/fi";

function EmptyTab({ icon: Icon, message, ctaLabel, ctaTo }) {
  return (
    <div className="text-center py-16 bg-stone-50 border border-dashed border-stone-200 rounded-2xl">
      <Icon size={40} className="text-stone-300 mx-auto mb-3" />
      <p className="text-sm text-stone-500 mb-3">{message}</p>
      {ctaLabel && ctaTo && (
        <Link to={ctaTo} className="text-xs font-semibold text-orange-700 hover:text-orange-900">
          {ctaLabel} →
        </Link>
      )}
    </div>
  );
}

export default function ProfileStudentContent({ user, listings, roommate, events, teamRequests, helpPosts = [], isOwn }) {
  const [tab, setTab] = useState("overview");

  return (
    <>
      <ProfileTabs
        active={tab}
        onChange={setTab}
        counts={{
          listings: listings.length,
          events: events.length,
          team: teamRequests.length,
          roommate: roommate ? 1 : 0,
          help: helpPosts.length,
        }}
      />
     {tab === "help" && (
        <div>
            {helpPosts.length === 0 ? (
            <EmptyTab icon={FiHelpCircle} message="No open help posts." />
            ) : (
            <div className="space-y-3">
                {helpPosts.map((p) => (
                <Link key={p._id} to={`/help/${p._id}`} className="group block bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-5 transition-all">
                    <h4 className="font-serif font-bold text-base text-stone-900 mb-1 group-hover:text-orange-700 transition-colors">{p.title}</h4>
                    <p className="text-sm text-stone-600 line-clamp-2 mb-2">{p.description}</p>
                    <div className="text-xs text-stone-500">{p.replies?.length || 0} replies</div>
                </Link>
                ))}
            </div>
            )}
        </div>
        )}
      {tab === "overview" && (
        <div className="space-y-6">
          {user.bio && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">About</h2>
              <p className="text-stone-700 leading-relaxed whitespace-pre-line">{user.bio}</p>
            </div>
          )}
          {user.currentProject && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">Currently working on</h2>
              <p className="text-stone-700 leading-relaxed">{user.currentProject}</p>
            </div>
          )}
          {user.company && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">Currently at</h2>
              <div className="flex items-center gap-2 text-stone-700">
                <FiBriefcase size={14} className="text-stone-400" /> {user.company}
              </div>
            </div>
          )}
          {user.skills?.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-stone-700">{s}</span>
                ))}
              </div>
            </div>
          )}
          {!user.bio && !user.currentProject && !user.skills?.length && !user.company && (
            <EmptyTab
              icon={FiStar}
              message={isOwn ? "You haven't added a bio yet." : "This student hasn't filled out their profile yet."}
              ctaLabel={isOwn ? "Edit your profile" : null}
              ctaTo={isOwn ? "/profile/edit" : null}
            />
          )}
        </div>
      )}

      {tab === "listings" && (
        <div>
          {listings.length === 0 ? (
            <EmptyTab icon={FiStar} message="No active listings." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings.map((l) => (
                <Link key={l._id} to={`/marketplace/${l._id}`} className="group bg-white border border-stone-200 hover:border-stone-300 rounded-2xl overflow-hidden transition-all">
                  {l.images?.[0] && (
                    <div className="h-32 overflow-hidden bg-stone-100">
                      <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-orange-700 transition-colors">{l.title}</div>
                    <div className="text-xs text-stone-500 mt-1">Rs. {l.price?.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "roommate" && (
        <div>
          {!roommate ? (
            <EmptyTab icon={FiMapPin} message="No roommate profile." />
          ) : (
            <Link to={`/roommates/${roommate._id}`} className="group block bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-6 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                  {roommate.kind === "have-room" ? "Has a room" : "Looking for a room"}
                </span>
                <FiArrowUpRight size={16} className="text-stone-400 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">{roommate.title}</h3>
              <p className="text-sm text-stone-600 line-clamp-2">{roommate.description}</p>
            </Link>
          )}
        </div>
      )}

      {tab === "events" && (
        <div>
          {events.length === 0 ? (
            <EmptyTab icon={FiCalendar} message="Not going to any events yet." />
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <Link key={e._id} to={`/events/${e._id}`} className="group flex gap-3 bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-4 transition-all">
                  {e.coverImage ? (
                    <img src={e.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-stone-100 grid place-items-center shrink-0">
                      <FiCalendar size={20} className="text-stone-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-stone-900 group-hover:text-orange-700 transition-colors line-clamp-1">{e.title}</div>
                    <div className="text-xs text-stone-500 mt-1">
                      {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} • {e.venue}
                    </div>
                  </div>
                  <FiArrowUpRight size={16} className="text-stone-400 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "team" && (
        <div>
          {teamRequests.length === 0 ? (
            <EmptyTab icon={FiStar} message="No open team requests." />
          ) : (
            <div className="space-y-3">
              {teamRequests.map((tr) => (
                <Link key={tr._id} to={`/team-requests/${tr._id}`} className="group block bg-indigo-50/60 border border-indigo-200/70 hover:border-indigo-300 rounded-2xl p-5 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-indigo-600 text-white">Team request</span>
                    <FiArrowUpRight size={16} className="text-indigo-500 shrink-0" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-indigo-950 mb-1">{tr.teamName}</h4>
                  <p className="text-xs text-indigo-900/70 mb-2">{tr.eventId?.title}</p>
                  <p className="text-sm text-indigo-900/80 line-clamp-2">{tr.pitch}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}