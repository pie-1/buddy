## buddy

step1 : sitemap
PUBLIC
├── Landing
├── Browse Marketplace (buy/sell, borrow/rent)
├── Events
├── Student Spotlight (weekly top 3)
└── About / Open Source (maintainers, how to contribute, who reviews PRs)

AUTH
├── Sign up → college email domain check → OTP/verify link
└── Fallback: manual verification request (if applicable — pending your answer)

STUDENT APP (authenticated, verified)
├── Dashboard
│   ├── My listings / borrow requests (status: active, requested, confirmed, completed)
│   ├── My RSVPs & teammate posts
│   ├── Chat inbox summary
│   ├── Verification + reputation status
│   └── Spotlight status (if purchased this week)
├── Marketplace
│   ├── Buy/Sell listings
│   ├── Borrow/Rent listings (cost + deadline fields)
│   ├── Listing detail → Request → contextual chat thread
│   └── My listings (create/edit/close)
├── Events
│   ├── Event feed (filter: department/college/date)
│   ├── Event detail → RSVP → reminder
│   └── Teammate board per event (if we attach it here)
├── Projects & Teammates
│   ├── Post project (title, dept, skills, roles needed)
│   ├── Browse/apply → contextual chat
│   └── My posts / applications
├── Roommates
│   ├── Listings with filters
│   ├── Listing detail → chat
│   └── My listing
├── Community / Connect  ← form TBD by your answer
├── Chat (unified inbox)
│   └── All threads carry context: listing:123 / event:456 / project:789 / roommate:012
└── Profile
    ├── Verification badge, department, college
    ├── Reputation (completed exchanges, ratings)
    ├── Spotlight purchase entry point
    └── Public view (linkable)

ADMIN DASHBOARD (role: moderator/admin — club only)
├── Verification queue (email domain whitelist mgmt, manual approvals)
├── Moderation (listings, profiles, reports)
├── Dispute/report queue
├── Spotlight management (verify Rs 100 payment proof → assign 3 slots)
├── Event management (if club-created)
├── User management (roles: student / moderator / admin)
└── Analytics (DAU, listings, completions, RSVPs, spotlight revenue)


# Auth and verification
   1. Sign up → enter college email
   2. System checks domain against whitelist ──✗→ reject ("use your college email")
   3. Send OTP / magic link
   4. Verify → account created (role: student, verified: true)
   5. Onboarding: department, year, college, display name, photo
   6. Profile live → can now access all features

# Marketplace — Buy/Sell
    1. Seller creates listing: title, photos, price, category, condition, description
    2. Listing published (auto, reportable)
    3. Buyer browses → listing detail
    4. Buyer taps "Request" ──→ opens chat thread [context:listing:<id>]
    5. Negotiation in chat (off-platform payment, in-person handoff)
    6. Either party taps "Mark as sold" → other confirms
    7. Both prompted to rate each other → reputation updated
    8. Listing → status: sold, hidden from browse

# Marketplace — Borrow/Rent
    Listing fields: rental cost + period (per day/week) + return deadline + deposit (optional, shown only)
    4a. Borrower requests with proposed borrow window
    6a. Return confirmed by both → reputation updated

# Events
    1. Student/club creates event: title, description, photos, date/time, venue + map pin,
    department/college visibility, capacity (optional)
    2. Event published (auto, reportable)
    3. Attendee browses feed → filters (dept, college, date, type)
    4. Event detail → "Interested" / "Going" (RSVP)
    5. Reminder notification (e.g. 24h before)
    6. Attendee can start a group chat thread [context:event:<id>] for coordination
    7. Post-event: optional feedback / rating

# Projects & Teammates
    1. Poster creates project: title, description, skills/roles needed, dept, deadline
    2. Project published
    3. Others browse/filter → project detail
    4. Applicant taps "Apply" (short pitch) ──→ chat thread [context:project:<id>]
    5. Poster reviews applicants → accepts/rejects in-app
    6. Accepted applicants shown as "team" on project page
    7. Project → status: recruiting / in-progress / closed

# Roommates / Flatmates
    1. Lister creates listing: photos, rent, location (map pin), area/neighborhood,
    room type, gender preference, furnishing, amenities, move-in date, lease duration
    2. Listing published
    3. Seeker browses → filters (area, budget, gender pref, move-in date, amenities) + map view
    4. Listing detail → "Request contact / chat" ──→ chat thread [context:roommate:<id>]
    5. Conversation off-platform → either party marks "filled"
    6. Rating optional

# Community / Connect (proposed default — confirm)
    7a. Directory
    1. Browse verified students (filter: dept, college, year, skills/interests)
    2. Profile view (public profile) → "Message" ──→ chat [context:profile:<id>]

    7b. Anonymous Help / PYQ board
    1. Post anonymously (still tied to verified account internally)
    2. Others reply → replies are also anonymous or named (poster's choice)
    3. Upvote best answers → karma
    TG-8: anonymity is display-only; identity retained for admin moderation

    7c. Cross-department discovery feed
    1. Aggregated feed: recent events, projects, roommate listings, help posts
    2. Filter by department / college

# Unified Chat (cross-cutting spine)
    Every chat thread has: participants[], contextType, contextId
    Context types: listing | event | project | roommate | profile | support

    1. User opens chat inbox → grouped by context ("Marketplace", "Events", "Projects", "Roommates", "Direct")
    2. Opening a thread from any feature reuses the same thread if context+participants match
    3. Chat supports: text, images, listing/event/project card preview, "Mark as done" action
    4. "Mark as done" is the universal completion trigger → fires the feature-specific confirm step
    5. Block / report user → admin queue

# Spotlight (weekly)
    WEEK N-1 (prep)
    1. Student opens Spotlight page → sees club eSewa ID/QR + "Rs 100 for next week"
    2. Pays externally → submits txn ID + screenshot → claim created (status: pending)
    3. TG-11: admin matches claim vs eSewa statement → verify / reject
    4. Verified claims queued in payment order

    WEEK N (Mon 00:00 – Sun 23:59)
    5. On Monday 00:00, first 3 verified claims assigned slots → profiles pinned on Spotlight page
    6. If <3 verified claims: remaining slots filled by highest activity/reach score (proposed formula above)
    7. Slot profiles appear: pinned on Spotlight page, badge on profile, "Spotlight" chip on their listings
    8. End of Sunday 23:59 → slots expire, history logged

# Admin Dashboard
A. Verification queue
   1. Domain whitelist management (add/remove colleges)
   2. Email verification edge cases (failed OTP resends, blocked domains)
   TG: domain changes are admin-only

B. Spotlight queue
   1. Pending Rs 100 claims (txn ID + screenshot)
   2. Match against eSewa statement → Verify / Reject
   3. Manual slot override (activity fallback)
   TG: verification is admin-only

C. Moderation
   1. Reported listings / events / profiles / chat messages
   2. Actions: dismiss / hide / remove / warn / ban
   TG: all moderation actions logged with reason

D. Disputes
   1. "Mark as sold/returned" contested → dispute opened by either party
   2. Admin views chat thread context + evidence
   3. Resolve: complete / cancel / warn
   TG: resolution logged

E. User management
   1. Role assignment: student / moderator / admin
   2. Ban / unban
   TG: admin-only

F. Analytics
   - DAU, new signups, verification rate
   - Active listings by type, completion rate
   - Event RSVPs, project posts/applications
   - Spotlight claims + revenue
   - Report/dispute volume


# Refined activity score (for spotlight fallback slots)
    score =
    (completed_exchanges_30d        × 5.0)
    + (active_listings_30d             × 2.0)
    + (event_rsvps_attended_30d        × 1.5)
    + (project_applications_30d        × 2.5)
    + (help_board_upvotes_received_30d × 1.0)
    + (profile_views_7d                × 0.2)
    + (spotlight_verified_claims_90d   × 3.0)   // reward repeat supporters
    − (reports_upheld_30d              × 10.0)  // quality 
    # Rules:

        Window: only actions from the last 30 days count (except profile views at 7d and spotlight at 90d). This avoids legacy inflation.

        Cap per category: no single category can contribute >40% of total score, so one power-user behaviour doesn't dominate.

        Tie-breaker: earlier verified claim timestamp wins; if no claims, account age (older verified account ranks higher).

        Audit: expose the score breakdown to admins so fallback slot assignment is explainable, not a black box.

        Store as activityScore on the user document, recomputed nightly + on relevant events. This keeps spotlight assignment deterministic at Monday 00:00.

# Automatic spotlight payment
    unpaid  →  initiating (redirect/popup to eSewa)
            →  verifying  (polling / webhook received, status pending)
            →  verified   (slot queued; show rank if within top 3)
            →  rejected   (transaction failed; retry CTA)