import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#0B0F1A",
  surface: "#131929",
  card: "#1A2235",
  border: "#212D42",
  teal: "#00C9A7",
  saffron: "#FF6B35",
  amber: "#FFB800",
  red: "#FF4D6A",
  blue: "#3B82F6",
  indigo: "#6366F1",
  textPrimary: "#F0F4FF",
  textSec: "#7A8BA6",
  textMuted: "#4A5568",
};

const TABS = [
  { id: "overview", label: "Overview", icon: "⚡" },
  { id: "issues", label: "Issues", icon: "📋" },
  { id: "hotspots", label: "Hotspots", icon: "🔥" },
  { id: "officers", label: "Officers", icon: "👷" },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const WEEKLY = [
  { day: "Mon", reported: 42, resolved: 35 },
  { day: "Tue", reported: 58, resolved: 40 },
  { day: "Wed", reported: 35, resolved: 31 },
  { day: "Thu", reported: 67, resolved: 52 },
  { day: "Fri", reported: 48, resolved: 44 },
  { day: "Sat", reported: 29, resolved: 27 },
  { day: "Sun", reported: 18, resolved: 18 },
];

const TREND = [
  { month: "Jan", days: 21 }, { month: "Feb", days: 18 },
  { month: "Mar", days: 15 }, { month: "Apr", days: 11 },
  { month: "May", days: 8 },
];

const PIE_DATA = [
  { name: "Pothole", value: 34, color: C.saffron },
  { name: "Waterlogging", value: 22, color: C.blue },
  { name: "Streetlight", value: 18, color: C.amber },
  { name: "Garbage", value: 16, color: C.teal },
  { name: "Other", value: 10, color: C.indigo },
];

const WARDS = [
  { id: 3, name: "Ward 3", open: 42, resolved: 89, sla: 94, trend: "↑" },
  { id: 7, name: "Ward 7", open: 28, resolved: 112, sla: 88, trend: "↑" },
  { id: 9, name: "Ward 9", open: 67, resolved: 54, sla: 61, trend: "↓" },
  { id: 12, name: "Ward 12", open: 19, resolved: 134, sla: 97, trend: "↑" },
  { id: 15, name: "Ward 15", open: 53, resolved: 71, sla: 74, trend: "→" },
];

const ISSUES_LIST = [
  { id: "CP-0041", type: "Pothole", icon: "🕳️", ward: "Ward 9", priority: "Critical", status: "Overdue", officer: "Unassigned", age: "5d" },
  { id: "CP-0039", type: "Waterlogging", icon: "🌊", ward: "Ward 3", priority: "Critical", status: "In Progress", officer: "R. Sharma", age: "2d" },
  { id: "CP-0038", type: "Streetlight", icon: "💡", ward: "Ward 12", priority: "High", status: "Assigned", officer: "P. Kumar", age: "1d" },
  { id: "CP-0035", type: "Garbage", icon: "🗑️", ward: "Ward 7", priority: "Medium", status: "In Progress", officer: "A. Mehta", age: "3d" },
  { id: "CP-0033", type: "Sewage", icon: "🚧", ward: "Ward 15", priority: "High", status: "Received", officer: "Unassigned", age: "4d" },
  { id: "CP-0031", type: "Tree Fall", icon: "🌳", ward: "Ward 9", priority: "Critical", status: "Overdue", officer: "Unassigned", age: "6d" },
];

const HOTSPOTS = [
  { zone: "Station Road, Ward 3", risk: 92, type: "Waterlogging", predicted: "3 days", color: C.red },
  { zone: "MG Road, Ward 9", risk: 78, type: "Pothole", predicted: "5 days", color: C.saffron },
  { zone: "Park Ave, Ward 15", risk: 64, type: "Streetlight", predicted: "8 days", color: C.amber },
  { zone: "Civil Lines, Ward 7", risk: 51, type: "Garbage", predicted: "12 days", color: C.blue },
];

const OFFICERS = [
  { name: "Rahul Sharma", ward: "Ward 3", assigned: 8, resolved: 45, rate: 94, status: "Active" },
  { name: "Pradeep Kumar", ward: "Ward 12", assigned: 4, resolved: 62, rate: 97, status: "Active" },
  { name: "Anita Mehta", ward: "Ward 7", assigned: 6, resolved: 38, rate: 88, status: "Active" },
  { name: "Vijay Rao", ward: "Ward 15", assigned: 11, resolved: 29, rate: 72, status: "Overloaded" },
  { name: "Sunita Das", ward: "Ward 9", assigned: 14, resolved: 21, rate: 58, status: "Critical" },
];

// ─── Status / Priority helpers ─────────────────────────────────────────────
const STATUS_STYLE = {
  "Overdue":     { bg: "#FF4D6A22", color: C.red,      dot: C.red },
  "In Progress": { bg: "#FF6B3522", color: C.saffron,  dot: C.saffron },
  "Assigned":    { bg: "#FFB80022", color: C.amber,    dot: C.amber },
  "Received":    { bg: "#6366F122", color: C.indigo,   dot: C.indigo },
  "Resolved":    { bg: "#00C9A722", color: C.teal,     dot: C.teal },
};

const PRIORITY_COLOR = { Critical: C.red, High: C.saffron, Medium: C.amber, Low: C.teal };

const OFFICER_STATUS = {
  Active:     { bg: "#00C9A722", color: C.teal },
  Overloaded: { bg: "#FFB80022", color: C.amber },
  Critical:   { bg: "#FF4D6A22", color: C.red },
};

// ─── Reusable Components ───────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: "18px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: accent + "18",
        borderRadius: "0 16px 0 80px",
      }} />
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, letterSpacing: "-1px" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textSec, fontWeight: 600, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent, fontWeight: 700, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SlaBar({ value }) {
  const color = value >= 90 ? C.teal : value >= 75 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1, height: 6, background: C.border, borderRadius: 99, overflow: "hidden"
      }}>
        <div style={{
          width: `${value}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99,
          transition: "width 0.6s ease",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function RiskBar({ value, color }) {
  return (
    <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%",
        background: `linear-gradient(90deg, ${color}66, ${color})`,
        borderRadius: 99,
      }} />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: C.textSec, marginBottom: 4, fontWeight: 700 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

// ─── Views ──────────────────────────────────────────────────────────────────
function OverviewView() {
  return (
    <div>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <KpiCard icon="📥" label="Open Issues" value="209" sub="↑ 12 since yesterday" accent={C.saffron} />
        <KpiCard icon="✅" label="Resolved Today" value="47" sub="↑ 8% vs last week" accent={C.teal} />
        <KpiCard icon="⏱️" label="Avg. Resolution" value="4.2d" sub="↓ from 21d in Jan" accent={C.blue} />
        <KpiCard icon="🚨" label="SLA Breaches" value="14" sub="Ward 9 & 15 critical" accent={C.red} />
      </div>

      {/* Bar Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 }}>
          This Week — Reported vs Resolved
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={WEEKLY} barGap={4}>
            <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: C.border }} />
            <Bar dataKey="reported" fill={C.saffron} radius={[4, 4, 0, 0]} name="Reported" />
            <Bar dataKey="resolved" fill={C.teal} radius={[4, 4, 0, 0]} name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line + Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 12 }}>
            Avg. Days to Resolve
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={TREND}>
              <Line type="monotone" dataKey="days" stroke={C.teal} strokeWidth={2.5} dot={{ fill: C.teal, r: 3 }} />
              <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>
            By Type
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={22} outerRadius={38} dataKey="value" strokeWidth={0}>
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 6 }}>
            {PIE_DATA.slice(0, 3).map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: C.textSec }}>{d.name}</span>
                <span style={{ fontSize: 10, color: C.textPrimary, marginLeft: "auto", fontWeight: 700 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward SLA Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 }}>
          Ward SLA Performance
        </div>
        {WARDS.map((w) => (
          <div key={w.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{w.name}</span>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textSec }}>
                <span>🔴 {w.open} open</span>
                <span>✅ {w.resolved} done</span>
                <span style={{ color: w.trend === "↑" ? C.teal : w.trend === "↓" ? C.red : C.amber, fontWeight: 700 }}>{w.trend}</span>
              </div>
            </div>
            <SlaBar value={w.sla} />
          </div>
        ))}
      </div>
    </div>
  );
}

function IssuesView() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Overdue", "In Progress", "Assigned", "Received"];
  const filtered = filter === "All" ? ISSUES_LIST : ISSUES_LIST.filter(i => i.status === filter);

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter === s ? C.teal : C.card,
            color: filter === s ? C.bg : C.textSec,
            border: `1px solid ${filter === s ? C.teal : C.border}`,
            borderRadius: 20, padding: "6px 14px",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            transition: "all 0.15s",
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Issue rows */}
      {filtered.map((issue) => {
        const ss = STATUS_STYLE[issue.status] || {};
        return (
          <div key={issue.id} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: "14px 16px", marginBottom: 10,
            borderLeft: `3px solid ${PRIORITY_COLOR[issue.priority]}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{issue.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary }}>{issue.type}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{issue.id} · {issue.ward}</div>
                </div>
              </div>
              <span style={{
                background: ss.bg, color: ss.color,
                borderRadius: 20, padding: "4px 10px",
                fontSize: 11, fontWeight: 700,
              }}>{issue.status}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 11, color: C.textSec }}>
                  👷 {issue.officer === "Unassigned"
                    ? <span style={{ color: C.red, fontWeight: 700 }}>Unassigned</span>
                    : issue.officer}
                </span>
                <span style={{ fontSize: 11, color: C.textSec }}>🕐 {issue.age}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {issue.officer === "Unassigned" && (
                  <button style={{
                    background: C.saffron, color: "#fff", border: "none",
                    borderRadius: 8, padding: "5px 12px", fontSize: 11,
                    fontWeight: 700, cursor: "pointer",
                  }}>Assign</button>
                )}
                <button style={{
                  background: C.border, color: C.textSec, border: "none",
                  borderRadius: 8, padding: "5px 12px", fontSize: 11,
                  fontWeight: 700, cursor: "pointer",
                }}>View</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HotspotsView() {
  return (
    <div>
      {/* Intro banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.saffron}22, ${C.red}18)`,
        border: `1px solid ${C.saffron}44`,
        borderRadius: 16, padding: "16px 18px", marginBottom: 20,
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 28 }}>🔮</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>
            AI Predictive Maintenance
          </div>
          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>
            These zones are predicted to generate complaint spikes based on historical patterns, rainfall data, and IoT sensor readings.
          </div>
        </div>
      </div>

      {/* Hotspot cards */}
      {HOTSPOTS.map((h, i) => (
        <div key={i} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "16px 18px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, marginBottom: 3 }}>{h.zone}</div>
              <div style={{ fontSize: 11, color: C.textSec }}>Likely issue: <span style={{ color: h.color, fontWeight: 700 }}>{h.type}</span></div>
            </div>
            <div style={{
              background: h.color + "22", color: h.color,
              borderRadius: 10, padding: "6px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{h.risk}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Risk</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <RiskBar value={h.risk} color={h.color} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: C.textSec }}>⏳ Predicted spike in <strong style={{ color: C.textPrimary }}>{h.predicted}</strong></span>
            <button style={{
              background: C.teal, color: C.bg, border: "none",
              borderRadius: 8, padding: "6px 14px", fontSize: 11,
              fontWeight: 800, cursor: "pointer",
            }}>Pre-assign Team</button>
          </div>
        </div>
      ))}

      {/* IoT status */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 18px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
          📡 Live IoT Sensor Status
        </div>
        {[
          { name: "Smart Streetlights", count: "142 sensors", ok: 138, alert: 4, color: C.amber },
          { name: "Flood Monitors", count: "28 stations", ok: 25, alert: 3, color: C.blue },
          { name: "Waste Fill Sensors", count: "64 bins", ok: 57, alert: 7, color: C.teal },
        ].map((s) => (
          <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{s.count}</div>
            </div>
            <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
              <span style={{ color: C.teal, fontWeight: 700 }}>✅ {s.ok}</span>
              <span style={{ color: C.red, fontWeight: 700 }}>⚠️ {s.alert}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OfficersView() {
  return (
    <div>
      {/* Load summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Active", val: 3, color: C.teal },
          { label: "Overloaded", val: 1, color: C.amber },
          { label: "Critical", val: 1, color: C.red },
        ].map(s => (
          <div key={s.label} style={{
            background: C.card, border: `1px solid ${s.color}44`,
            borderRadius: 12, padding: "12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: C.textSec, fontWeight: 700, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Officer cards */}
      {OFFICERS.map((o) => {
        const os = OFFICER_STATUS[o.status];
        return (
          <div key={o.name} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "16px 18px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.indigo}, ${C.blue})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800, color: "#fff",
                }}>
                  {o.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary }}>{o.name}</div>
                  <div style={{ fontSize: 11, color: C.textSec }}>{o.ward}</div>
                </div>
              </div>
              <span style={{
                background: os.bg, color: os.color,
                borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700,
              }}>{o.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { label: "Assigned", val: o.assigned, color: C.saffron },
                { label: "Resolved", val: o.resolved, color: C.teal },
                { label: "SLA Rate", val: `${o.rate}%`, color: o.rate >= 90 ? C.teal : o.rate >= 75 ? C.amber : C.red },
              ].map(m => (
                <div key={m.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>{m.label}</div>
                </div>
              ))}
            </div>

            <SlaBar value={o.rate} />

            {o.status !== "Active" && (
              <button style={{
                width: "100%", marginTop: 12, padding: "9px",
                background: C.saffron, color: "#fff", border: "none",
                borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                ⚡ Redistribute Tasks
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CivicPulseDashboard() {
  const [tab, setTab] = useState("overview");

  const VIEW = { overview: OverviewView, issues: IssuesView, hotspots: HotspotsView, officers: OfficersView };
  const ActiveView = VIEW[tab];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Sora', sans-serif",
      background: C.bg, minHeight: "100vh",
      maxWidth: 480, margin: "0 auto",
      color: C.textPrimary,
    }}>
      {/* Header */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "16px 18px", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>⚡</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.4px" }}>CivicPulse</div>
              <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                Municipal Command
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              background: C.red + "22", border: `1px solid ${C.red}44`,
              borderRadius: 20, padding: "4px 10px",
              fontSize: 11, color: C.red, fontWeight: 700,
            }}>🚨 14 SLA breaches</div>
          </div>
        </div>

        {/* Officer info bar */}
        <div style={{
          background: C.card, borderRadius: 10, padding: "8px 12px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.indigo}, ${C.blue})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800,
            }}>SC</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Suresh Chandra</div>
              <div style={{ fontSize: 10, color: C.textSec }}>Ward Commissioner · Pune Zone 2</div>
            </div>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: C.teal,
            boxShadow: `0 0 6px ${C.teal}`,
          }} />
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 4px",
              background: tab === t.id ? C.teal : "transparent",
              color: tab === t.id ? C.bg : C.textSec,
              border: `1px solid ${tab === t.id ? C.teal : C.border}`,
              borderRadius: 10, fontSize: 10, fontWeight: 700,
              cursor: "pointer", textAlign: "center",
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 16px 40px" }}>
        <ActiveView />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}
