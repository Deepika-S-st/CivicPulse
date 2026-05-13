import { useState } from "react";

const COLORS = {
  saffron: "#FF6B35",
  indigo: "#1A1F5E",
  teal: "#00B4A0",
  cream: "#FFF8F0",
  amber: "#FFB800",
  red: "#E63946",
  lightTeal: "#E0FAF7",
  lightSaffron: "#FFF0E8",
};

const ISSUES = [
  { id: 1, type: "Pothole", icon: "🕳️", location: "MG Road, Ward 12", status: "In Progress", priority: "High", time: "2h ago", upvotes: 34, img: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=400&q=80" },
  { id: 2, type: "Broken Streetlight", icon: "💡", location: "Nehru Nagar, Ward 7", status: "Resolved", priority: "Medium", time: "1d ago", upvotes: 18, img: null },
  { id: 3, type: "Waterlogging", icon: "🌊", location: "Station Road, Ward 3", status: "Received", priority: "Critical", time: "30m ago", upvotes: 67, img: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&q=80" },
  { id: 4, type: "Garbage Dumping", icon: "🗑️", location: "Park Street, Ward 9", status: "Assigned", priority: "Medium", time: "3h ago", upvotes: 12, img: null },
];

const CATEGORIES = [
  { label: "Pothole", icon: "🕳️" },
  { label: "Streetlight", icon: "💡" },
  { label: "Waterlogging", icon: "🌊" },
  { label: "Garbage", icon: "🗑️" },
  { label: "Sewage", icon: "🚧" },
  { label: "Tree Fall", icon: "🌳" },
];

const STATUS_COLOR = {
  "Received": { bg: "#EEF2FF", text: "#4338CA" },
  "Assigned": { bg: "#FEF9C3", text: "#A16207" },
  "In Progress": { bg: "#FFF0E8", text: "#EA580C" },
  "Resolved": { bg: "#DCFCE7", text: "#166534" },
};

const PRIORITY_COLOR = {
  "Critical": COLORS.red,
  "High": COLORS.saffron,
  "Medium": COLORS.amber,
  "Low": COLORS.teal,
};

const TABS = ["Feed", "Report", "My Issues", "Leaderboard"];

const styles = {
  app: {
    fontFamily: "'Sora', 'Noto Sans', sans-serif",
    background: COLORS.cream,
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    overflowX: "hidden",
  },
  header: {
    background: COLORS.indigo,
    padding: "20px 20px 16px",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoMark: {
    width: 34,
    height: 34,
    background: `linear-gradient(135deg, ${COLORS.saffron}, ${COLORS.amber})`,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  logoText: {
    color: "#fff",
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: "-0.5px",
  },
  logoSub: {
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  notifBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: 10,
    width: 38,
    height: 38,
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    background: COLORS.saffron,
    borderRadius: "50%",
    border: "2px solid " + COLORS.indigo,
  },
  searchBar: {
    background: "rgba(255,255,255,0.12)",
    border: "1.5px solid rgba(255,255,255,0.18)",
    borderRadius: 12,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    cursor: "text",
  },
  cityBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "rgba(0,180,160,0.15)",
    border: "1px solid rgba(0,180,160,0.3)",
    borderRadius: 20,
    padding: "3px 10px",
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    marginTop: 8,
  },
  statsRow: {
    display: "flex",
    gap: 10,
    padding: "14px 16px",
    overflowX: "auto",
  },
  statCard: {
    flex: "0 0 auto",
    background: "#fff",
    borderRadius: 14,
    padding: "12px 16px",
    minWidth: 100,
    boxShadow: "0 2px 12px rgba(26,31,94,0.07)",
  },
  statNum: {
    fontSize: 22,
    fontWeight: 800,
    color: COLORS.indigo,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    padding: "0 16px",
    marginBottom: 10,
  },
  categoryRow: {
    display: "flex",
    gap: 8,
    padding: "0 16px 16px",
    overflowX: "auto",
  },
  catChip: (active) => ({
    flex: "0 0 auto",
    background: active ? COLORS.indigo : "#fff",
    color: active ? "#fff" : COLORS.indigo,
    border: `1.5px solid ${active ? COLORS.indigo : "#E5E7EB"}`,
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  }),
  issueCard: {
    background: "#fff",
    borderRadius: 16,
    margin: "0 16px 12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(26,31,94,0.07)",
  },
  cardImg: {
    width: "100%",
    height: 140,
    objectFit: "cover",
  },
  cardBody: {
    padding: "14px 16px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardType: {
    fontSize: 16,
    fontWeight: 800,
    color: COLORS.indigo,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  priorityDot: (p) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: PRIORITY_COLOR[p] || "#ccc",
    display: "inline-block",
  }),
  statusBadge: (s) => ({
    background: STATUS_COLOR[s]?.bg || "#f3f4f6",
    color: STATUS_COLOR[s]?.text || "#374151",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 700,
  }),
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #F3F4F6",
    paddingTop: 10,
    marginTop: 4,
  },
  upvoteBtn: (voted) => ({
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: voted ? COLORS.lightSaffron : "transparent",
    border: `1.5px solid ${voted ? COLORS.saffron : "#E5E7EB"}`,
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 700,
    color: voted ? COLORS.saffron : "#6B7280",
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  trackBtn: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.teal,
    background: COLORS.lightTeal,
    border: "none",
    borderRadius: 20,
    padding: "5px 14px",
    cursor: "pointer",
  },
  // Report form
  reportContainer: {
    padding: "20px 16px",
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: COLORS.indigo,
    marginBottom: 4,
  },
  reportSub: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
  },
  uploadZone: {
    border: `2px dashed ${COLORS.teal}`,
    borderRadius: 16,
    padding: "32px 20px",
    textAlign: "center",
    background: COLORS.lightTeal,
    marginBottom: 16,
    cursor: "pointer",
  },
  uploadIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.indigo,
    marginBottom: 4,
  },
  uploadSub: {
    fontSize: 12,
    color: "#6B7280",
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    display: "block",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid #E5E7EB",
    fontSize: 14,
    color: COLORS.indigo,
    fontFamily: "inherit",
    fontWeight: 600,
    marginBottom: 14,
    background: "#fff",
    appearance: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid #E5E7EB",
    fontSize: 14,
    color: COLORS.indigo,
    fontFamily: "inherit",
    marginBottom: 14,
    background: "#fff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid #E5E7EB",
    fontSize: 14,
    color: COLORS.indigo,
    fontFamily: "inherit",
    marginBottom: 14,
    background: "#fff",
    minHeight: 80,
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    background: `linear-gradient(135deg, ${COLORS.saffron}, ${COLORS.amber})`,
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
  voiceBtn: {
    width: "100%",
    padding: "13px",
    background: COLORS.lightTeal,
    color: COLORS.teal,
    border: `1.5px solid ${COLORS.teal}`,
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  // Leaderboard
  lbContainer: {
    padding: "20px 16px",
  },
  lbTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: COLORS.indigo,
    marginBottom: 4,
  },
  lbSub: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
  },
  lbCard: (i) => ({
    background: i === 0 ? `linear-gradient(135deg, ${COLORS.saffron}15, ${COLORS.amber}20)` : "#fff",
    border: i === 0 ? `2px solid ${COLORS.amber}` : "1.5px solid #F3F4F6",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 14,
  }),
  lbRank: (i) => ({
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: i === 0 ? COLORS.amber : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#F3F4F6",
    color: i < 3 ? "#fff" : "#6B7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
  }),
  lbName: {
    fontWeight: 700,
    color: COLORS.indigo,
    fontSize: 15,
    flex: 1,
  },
  lbBadge: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  lbPoints: {
    fontWeight: 800,
    fontSize: 16,
    color: COLORS.saffron,
  },
  pointsLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "right",
  },
  myBadges: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    background: COLORS.lightTeal,
    border: `1.5px solid ${COLORS.teal}`,
    borderRadius: 12,
    padding: "8px 12px",
    textAlign: "center",
    flex: 1,
  },
  badgeIcon: { fontSize: 22, display: "block", marginBottom: 4 },
  badgeLabel: { fontSize: 10, fontWeight: 700, color: COLORS.teal },
  // My Issues
  myContainer: { padding: "20px 16px" },
  myTitle: { fontSize: 22, fontWeight: 800, color: COLORS.indigo, marginBottom: 4 },
  mySub: { fontSize: 13, color: "#6B7280", marginBottom: 20 },
  timelineCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "16px",
    marginBottom: 14,
    boxShadow: "0 2px 12px rgba(26,31,94,0.07)",
  },
  tlHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  tlType: { fontWeight: 800, color: COLORS.indigo, fontSize: 15 },
  tlId: { fontSize: 11, color: "#9CA3AF", fontWeight: 600 },
  timeline: { position: "relative", paddingLeft: 20 },
  tlLine: {
    position: "absolute",
    left: 6,
    top: 0,
    bottom: 0,
    width: 2,
    background: "#F3F4F6",
  },
  tlItem: (active) => ({
    position: "relative",
    paddingLeft: 18,
    paddingBottom: 14,
    fontSize: 13,
    color: active ? COLORS.indigo : "#9CA3AF",
    fontWeight: active ? 700 : 500,
  }),
  tlDot: (active) => ({
    position: "absolute",
    left: -14,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: active ? COLORS.teal : "#E5E7EB",
    border: `2px solid ${active ? COLORS.teal : "#E5E7EB"}`,
  }),
  // Nav
  nav: {
    position: "sticky",
    bottom: 0,
    background: "#fff",
    borderTop: "1.5px solid #F3F4F6",
    display: "flex",
    zIndex: 50,
    boxShadow: "0 -4px 20px rgba(26,31,94,0.08)",
  },
  navItem: (active) => ({
    flex: 1,
    padding: "12px 0 10px",
    textAlign: "center",
    cursor: "pointer",
    color: active ? COLORS.saffron : "#9CA3AF",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    borderTop: active ? `2px solid ${COLORS.saffron}` : "2px solid transparent",
    transition: "all 0.15s",
  }),
  navIcon: { fontSize: 20, display: "block", marginBottom: 2 },
  // Success
  successOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,31,94,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    backdropFilter: "blur(4px)",
  },
  successCard: {
    background: "#fff",
    borderRadius: 24,
    padding: "36px 28px",
    textAlign: "center",
    margin: 24,
    maxWidth: 340,
  },
  successIcon: { fontSize: 56, marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: 800, color: COLORS.indigo, marginBottom: 8 },
  successSub: { fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 },
  successId: {
    background: COLORS.lightTeal,
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.teal,
    marginBottom: 20,
  },
  successBtn: {
    width: "100%",
    padding: "13px",
    background: COLORS.indigo,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};

const LEADERBOARD = [
  { name: "Ravi Shankar", ward: "Ward 12", points: 1240, badges: ["🏆", "⚡", "🌟"] },
  { name: "Priya Nair", ward: "Ward 7", points: 980, badges: ["⚡", "🌟"] },
  { name: "Amar Singh", ward: "Ward 3", points: 820, badges: ["🌟"] },
  { name: "Kavitha R.", ward: "Ward 9", points: 670, badges: [] },
  { name: "Suresh M.", ward: "Ward 12", points: 510, badges: [] },
];

const MY_ISSUES = [
  {
    id: "CP-2024-0041",
    type: "Pothole",
    icon: "🕳️",
    steps: ["Received", "Assigned", "In Progress", "Resolved"],
    current: 2,
  },
  {
    id: "CP-2024-0038",
    type: "Garbage Dumping",
    icon: "🗑️",
    steps: ["Received", "Assigned", "In Progress", "Resolved"],
    current: 3,
  },
];

export default function CivicPulse() {
  const [tab, setTab] = useState("Feed");
  const [activeCategory, setActiveCategory] = useState("All");
  const [voted, setVoted] = useState({});
  const [reportForm, setReportForm] = useState({ type: "", location: "", desc: "" });
  const [submitted, setSubmitted] = useState(false);
  const [issueId] = useState("CP-2024-" + Math.floor(Math.random() * 900 + 100));

  const NAV_ICONS = { Feed: "🏠", Report: "📸", "My Issues": "📋", Leaderboard: "🏆" };

  const handleVote = (id) => {
    setVoted((v) => ({ ...v, [id]: !v[id] }));
  };

  const handleSubmit = () => {
    if (reportForm.type && reportForm.location) setSubmitted(true);
  };

  const filteredIssues =
    activeCategory === "All"
      ? ISSUES
      : ISSUES.filter((i) => i.type.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <div style={styles.logoMark}>📡</div>
            <div>
              <div style={styles.logoText}>CivicPulse</div>
              <div style={styles.logoSub}>Smart Cities</div>
            </div>
          </div>
          <button style={styles.notifBtn}>
            🔔<span style={styles.notifDot} />
          </button>
        </div>
        <div style={styles.searchBar}>
          <span>🔍</span>
          <span>Search issues in your ward…</span>
        </div>
        <div style={styles.cityBadge}>📍 Pune, Ward 12 · Maharashtra</div>
      </div>

      {/* Content */}
      <div style={{ paddingBottom: 80 }}>
        {tab === "Feed" && (
          <>
            {/* Stats */}
            <div style={styles.statsRow}>
              {[
                { num: "247", label: "Active Issues" },
                { num: "83%", label: "Resolved" },
                { num: "4.2d", label: "Avg. Time" },
                { num: "12", label: "Your Ward" },
              ].map((s) => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statNum}>{s.num}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div style={{ padding: "4px 0 0" }}>
              <div style={styles.sectionTitle}>Filter by Type</div>
              <div style={styles.categoryRow}>
                {[{ label: "All", icon: "🗺️" }, ...CATEGORIES].map((c) => (
                  <button
                    key={c.label}
                    style={styles.catChip(activeCategory === c.label)}
                    onClick={() => setActiveCategory(c.label)}
                  >
                    <span>{c.icon}</span> {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Issue Cards */}
            <div style={styles.sectionTitle}>Recent Reports</div>
            {filteredIssues.map((issue) => (
              <div key={issue.id} style={styles.issueCard}>
                {issue.img && (
                  <img src={issue.img} alt={issue.type} style={styles.cardImg} />
                )}
                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardType}>
                      {issue.icon} {issue.type}
                      <span style={styles.priorityDot(issue.priority)} title={issue.priority} />
                    </div>
                    <span style={styles.statusBadge(issue.status)}>{issue.status}</span>
                  </div>
                  <div style={styles.cardMeta}>
                    <span>📍 {issue.location}</span>
                    <span>·</span>
                    <span>🕐 {issue.time}</span>
                  </div>
                  <div style={styles.cardActions}>
                    <button style={styles.upvoteBtn(voted[issue.id])} onClick={() => handleVote(issue.id)}>
                      👍 {voted[issue.id] ? issue.upvotes + 1 : issue.upvotes} Agree
                    </button>
                    <button style={styles.trackBtn}>Track →</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "Report" && (
          <div style={styles.reportContainer}>
            <div style={styles.reportTitle}>Report an Issue</div>
            <div style={styles.reportSub}>Help keep your city clean & safe</div>

            <div style={styles.uploadZone}>
              <div style={styles.uploadIcon}>📸</div>
              <div style={styles.uploadText}>Add Photo or Video</div>
              <div style={styles.uploadSub}>AI will auto-detect the issue type</div>
            </div>

            <button style={styles.voiceBtn}>🎙️ Report by Voice (हिंदी / English)</button>

            <label style={styles.label}>Issue Type</label>
            <select
              style={styles.select}
              value={reportForm.type}
              onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
            >
              <option value="">Select issue type…</option>
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>{c.icon} {c.label}</option>
              ))}
            </select>

            <label style={styles.label}>Location</label>
            <input
              style={styles.input}
              placeholder="Use GPS or type address…"
              value={reportForm.location}
              onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
            />

            <label style={styles.label}>Description (optional)</label>
            <textarea
              style={styles.textarea}
              placeholder="Describe the issue briefly…"
              value={reportForm.desc}
              onChange={(e) => setReportForm({ ...reportForm, desc: e.target.value })}
            />

            <button style={styles.submitBtn} onClick={handleSubmit}>
              Submit Report 🚀
            </button>
          </div>
        )}

        {tab === "My Issues" && (
          <div style={styles.myContainer}>
            <div style={styles.myTitle}>My Reports</div>
            <div style={styles.mySub}>Track your submissions in real time</div>

            {MY_ISSUES.map((issue) => (
              <div key={issue.id} style={styles.timelineCard}>
                <div style={styles.tlHeader}>
                  <div style={styles.tlType}>{issue.icon} {issue.type}</div>
                  <div style={styles.tlId}>{issue.id}</div>
                </div>
                <div style={styles.timeline}>
                  <div style={styles.tlLine} />
                  {issue.steps.map((step, i) => (
                    <div key={step} style={styles.tlItem(i <= issue.current)}>
                      <div style={styles.tlDot(i <= issue.current)} />
                      {step}
                      {i === issue.current && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: COLORS.teal }}>← Now</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Leaderboard" && (
          <div style={styles.lbContainer}>
            <div style={styles.lbTitle}>Ward Champions 🏆</div>
            <div style={styles.lbSub}>Top civic reporters this month</div>

            {/* Your badges */}
            <div style={styles.sectionTitle}>Your Badges</div>
            <div style={styles.myBadges}>
              {[
                { icon: "🌟", label: "First Report" },
                { icon: "⚡", label: "5 Reports" },
                { icon: "🔥", label: "7-day Streak" },
              ].map((b) => (
                <div key={b.label} style={styles.badge}>
                  <span style={styles.badgeIcon}>{b.icon}</span>
                  <span style={styles.badgeLabel}>{b.label}</span>
                </div>
              ))}
            </div>

            <div style={styles.sectionTitle}>This Month</div>
            {LEADERBOARD.map((user, i) => (
              <div key={user.name} style={styles.lbCard(i)}>
                <div style={styles.lbRank(i)}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.lbName}>{user.name}</div>
                  <div style={styles.lbBadge}>{user.ward} · {user.badges.join(" ") || "No badges yet"}</div>
                </div>
                <div>
                  <div style={styles.lbPoints}>{user.points}</div>
                  <div style={styles.pointsLabel}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={styles.nav}>
        {TABS.map((t) => (
          <div key={t} style={styles.navItem(tab === t)} onClick={() => setTab(t)}>
            <span style={styles.navIcon}>{NAV_ICONS[t]}</span>
            {t}
          </div>
        ))}
      </div>

      {/* Success Modal */}
      {submitted && (
        <div style={styles.successOverlay}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <div style={styles.successTitle}>Issue Reported!</div>
            <div style={styles.successSub}>
              Your complaint has been received and will be assigned to the ward officer within 2 hours.
            </div>
            <div style={styles.successId}>🔖 Tracking ID: {issueId}</div>
            <button
              style={styles.successBtn}
              onClick={() => { setSubmitted(false); setTab("My Issues"); setReportForm({ type: "", location: "", desc: "" }); }}
            >
              Track My Issue →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        select { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
