"use client";

import { useState, useEffect, useCallback } from "react";

interface Assignment {
  id: string;
  name: string;
  email: string | null;
  role: string;
  type: string;
  region: string | null;
  hoursLogged: number;
}

interface Update {
  id: string;
  authorName: string;
  authorRole: string | null;
  type: string;
  title: string;
  body: string;
  hoursSpent: number | null;
  blockers: string | null;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  service: string;
  tier: string | null;
  status: string;
  plannedStart: string | null;
  plannedEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  contractValue: number;
  billedAmount: number;
  clientNps: number | null;
  clientFeedback: string | null;
  description: string | null;
  assignments: Assignment[];
  updates: Update[];
  _count: { updates: number };
  createdAt: string;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  PLANNING: { label: "Planning", color: "text-slate-400", bg: "bg-slate-500/10", dot: "\u26AA" },
  IN_PROGRESS: { label: "In Progress", color: "text-sky-400", bg: "bg-sky-500/10", dot: "\uD83D\uDD35" },
  ON_HOLD: { label: "On Hold", color: "text-amber-400", bg: "bg-amber-500/10", dot: "\uD83D\uDFE1" },
  COMPLETED: { label: "Completed", color: "text-green-400", bg: "bg-green-500/10", dot: "\uD83D\uDFE2" },
  CANCELLED: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10", dot: "\uD83D\uDD34" },
};

const SERVICE_LABELS: Record<string, string> = {
  SOVEREIGN_AI: "Private AI", AI_READINESS_360: "AI Readiness 360",
  TRANSFORMATION_MANAGEMENT: "Transformation", AEGIS: "AEGIS",
};

const UPDATE_ICONS: Record<string, string> = {
  STATUS_UPDATE: "\uD83D\uDCDD", MILESTONE_REACHED: "\uD83C\uDFC1", BLOCKER_REPORTED: "\uD83D\uDEA7",
  HOURS_LOGGED: "\u23F1\uFE0F", COMPLETED: "\u2705", CLIENT_FEEDBACK: "\u2B50",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [showUpdate, setShowUpdate] = useState<string | null>(null);

  // Create form
  const [newProject, setNewProject] = useState({ name: "", clientName: "", service: "SOVEREIGN_AI", tier: "Gold", plannedStart: "", plannedEnd: "", contractValue: "", description: "" });
  const [newAssignment, setNewAssignment] = useState({ name: "", email: "", role: "", type: "Contractor", region: "US" });
  const [newUpdate, setNewUpdate] = useState({ authorName: "", authorRole: "", type: "STATUS_UPDATE", title: "", body: "", hoursSpent: "", blockers: "" });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = filter !== "all" ? `?status=${filter}` : "";
    const res = await fetch(`/api/v1/projects${params}`);
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function handleCreate() {
    await fetch("/api/v1/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProject, contractValue: Number(newProject.contractValue) || 0 }),
    });
    setShowCreate(false);
    setNewProject({ name: "", clientName: "", service: "SOVEREIGN_AI", tier: "Gold", plannedStart: "", plannedEnd: "", contractValue: "", description: "" });
    fetchProjects();
  }

  async function handleAssign(projectId: string) {
    await fetch(`/api/v1/projects/${projectId}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAssignment),
    });
    setShowAssign(null);
    setNewAssignment({ name: "", email: "", role: "", type: "Contractor", region: "US" });
    fetchProjects();
  }

  async function handleUpdate(projectId: string) {
    await fetch(`/api/v1/projects/${projectId}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUpdate, hoursSpent: Number(newUpdate.hoursSpent) || undefined }),
    });
    setShowUpdate(null);
    setNewUpdate({ authorName: "", authorRole: "", type: "STATUS_UPDATE", title: "", body: "", hoursSpent: "", blockers: "" });
    fetchProjects();
  }

  async function handleStatusChange(projectId: string, status: string) {
    await fetch(`/api/v1/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(status === "IN_PROGRESS" ? { actualStart: new Date().toISOString() } : {}), ...(status === "COMPLETED" ? { actualEnd: new Date().toISOString() } : {}) }),
    });
    fetchProjects();
  }

  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const totalValue = projects.reduce((s, p) => s + p.contractValue, 0);
  const onTimeCount = projects.filter((p) => {
    if (p.status !== "COMPLETED" || !p.plannedEnd || !p.actualEnd) return false;
    return new Date(p.actualEnd) <= new Date(p.plannedEnd);
  }).length;
  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Tracker</h1>
          <p className="text-sm text-slate-400">Client delivery pipeline &mdash; assign resources, track progress, monitor satisfaction</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">
          + New Project
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MC label="Active Projects" value={String(activeProjects)} />
        <MC label="Total Contract Value" value={`$${totalValue.toLocaleString()}`} />
        <MC label="On-Time Delivery" value={completedCount > 0 ? `${Math.round((onTimeCount / completedCount) * 100)}%` : "N/A"} />
        <MC label="Avg Client NPS" value={(() => { const rated = projects.filter((p) => p.clientNps !== null); return rated.length > 0 ? (rated.reduce((s, p) => s + (p.clientNps || 0), 0) / rated.length).toFixed(1) : "N/A"; })()} />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${filter === f ? "bg-sky-500 text-white" : "border border-slate-700 text-slate-400 hover:text-white"}`}>
            {f === "all" ? "All" : STATUS_CFG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Project List */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" /></div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
          <p className="text-lg font-semibold text-slate-300">No projects yet</p>
          <p className="mt-2 text-sm text-slate-400">Create a project when a deal closes to start tracking delivery.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const st = STATUS_CFG[project.status] || STATUS_CFG.PLANNING;
            const isExpanded = expandedId === project.id;
            const isOverdue = project.plannedEnd && !project.actualEnd && new Date(project.plannedEnd) < new Date() && project.status === "IN_PROGRESS";

            return (
              <div key={project.id} className={`rounded-xl border ${isOverdue ? "border-red-500/30 bg-red-500/5" : "border-slate-800 bg-slate-900/30"}`}>
                <button onClick={() => setExpandedId(isExpanded ? null : project.id)} className="flex w-full items-center justify-between p-5 text-left">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{st.dot}</span>
                      <span className="text-sm font-bold text-slate-200">{project.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.color} ${st.bg}`}>{st.label}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">{SERVICE_LABELS[project.service] || project.service}</span>
                      {project.tier && <span className="text-[10px] text-slate-500">{project.tier}</span>}
                      {isOverdue && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400">OVERDUE</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                      <span>{project.clientName}</span>
                      <span>${project.contractValue.toLocaleString()}</span>
                      <span>{project.assignments.length} assigned</span>
                      <span>{project._count.updates} updates</span>
                      {project.clientNps !== null && <span className="text-green-400">NPS: {project.clientNps}</span>}
                    </div>
                  </div>
                  <span className="text-slate-500 text-xl">{isExpanded ? "\u2212" : "+"}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-800 px-5 pb-5 pt-4 space-y-4">
                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="text-xs"><span className="text-slate-500">Planned Start</span><p className="text-slate-300">{project.plannedStart ? new Date(project.plannedStart).toLocaleDateString() : "TBD"}</p></div>
                      <div className="text-xs"><span className="text-slate-500">Planned End</span><p className={`${isOverdue ? "text-red-400" : "text-slate-300"}`}>{project.plannedEnd ? new Date(project.plannedEnd).toLocaleDateString() : "TBD"}</p></div>
                      <div className="text-xs"><span className="text-slate-500">Actual Start</span><p className="text-slate-300">{project.actualStart ? new Date(project.actualStart).toLocaleDateString() : "\u2014"}</p></div>
                      <div className="text-xs"><span className="text-slate-500">Actual End</span><p className="text-slate-300">{project.actualEnd ? new Date(project.actualEnd).toLocaleDateString() : "\u2014"}</p></div>
                    </div>

                    {/* Assigned Resources */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Resources</h4>
                        <button onClick={() => setShowAssign(project.id)} className="text-[10px] text-sky-400 hover:text-sky-300">+ Assign</button>
                      </div>
                      {project.assignments.length === 0 ? (
                        <p className="text-xs text-slate-500">No one assigned yet</p>
                      ) : (
                        <div className="space-y-1">
                          {project.assignments.map((a) => (
                            <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{a.type === "FTE" ? "\uD83D\uDC64" : "\uD83D\uDCBC"}</span>
                                <span className="text-xs font-medium text-slate-200">{a.name}</span>
                                <span className="text-[10px] text-slate-500">{a.role}</span>
                                {a.region && <span className="text-[10px] text-slate-500">({a.region})</span>}
                              </div>
                              <span className="text-[10px] text-slate-400">{a.hoursLogged}h logged</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Updates Feed */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Updates</h4>
                        <button onClick={() => setShowUpdate(project.id)} className="text-[10px] text-sky-400 hover:text-sky-300">+ Add Update</button>
                      </div>
                      {project.updates.length === 0 ? (
                        <p className="text-xs text-slate-500">No updates yet</p>
                      ) : (
                        <div className="space-y-2">
                          {project.updates.map((u) => (
                            <div key={u.id} className="rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span>{UPDATE_ICONS[u.type] || "\uD83D\uDCDD"}</span>
                                <span className="font-medium text-slate-200">{u.title}</span>
                                <span className="text-slate-500">&middot; {u.authorName}</span>
                                <span className="text-slate-500">&middot; {new Date(u.createdAt).toLocaleDateString()}</span>
                                {u.hoursSpent && <span className="text-sky-400">{u.hoursSpent}h</span>}
                              </div>
                              <p className="mt-1 text-[11px] text-slate-400">{u.body}</p>
                              {u.blockers && <p className="mt-1 text-[11px] text-red-400">\uD83D\uDEA7 Blocker: {u.blockers}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status Actions */}
                    <div className="flex gap-2 pt-2">
                      {project.status === "PLANNING" && <button onClick={() => handleStatusChange(project.id, "IN_PROGRESS")} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400">Start Project</button>}
                      {project.status === "IN_PROGRESS" && <button onClick={() => handleStatusChange(project.id, "COMPLETED")} className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500">Mark Complete</button>}
                      {project.status === "IN_PROGRESS" && <button onClick={() => handleStatusChange(project.id, "ON_HOLD")} className="rounded-lg border border-amber-500/50 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/10">Put On Hold</button>}
                      {project.status === "ON_HOLD" && <button onClick={() => handleStatusChange(project.id, "IN_PROGRESS")} className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400">Resume</button>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreate && (
        <Modal title="New Project" onClose={() => setShowCreate(false)}>
          <div className="space-y-3">
            <Input label="Project Name" value={newProject.name} onChange={(v) => setNewProject({ ...newProject, name: v })} placeholder="Private AI Deployment — Acme Legal" />
            <Input label="Client Name" value={newProject.clientName} onChange={(v) => setNewProject({ ...newProject, clientName: v })} placeholder="Acme Law Firm" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Service" value={newProject.service} onChange={(v) => setNewProject({ ...newProject, service: v })} options={Object.entries(SERVICE_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
              <Select label="Tier" value={newProject.tier} onChange={(v) => setNewProject({ ...newProject, tier: v })} options={[{ value: "Silver", label: "Silver" }, { value: "Gold", label: "Gold" }, { value: "Platinum", label: "Platinum" }]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Planned Start" type="date" value={newProject.plannedStart} onChange={(v) => setNewProject({ ...newProject, plannedStart: v })} />
              <Input label="Planned End" type="date" value={newProject.plannedEnd} onChange={(v) => setNewProject({ ...newProject, plannedEnd: v })} />
            </div>
            <Input label="Contract Value ($)" type="number" value={newProject.contractValue} onChange={(v) => setNewProject({ ...newProject, contractValue: v })} placeholder="10000" />
            <button onClick={handleCreate} className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">Create Project</button>
          </div>
        </Modal>
      )}

      {/* Assign Resource Modal */}
      {showAssign && (
        <Modal title="Assign Resource" onClose={() => setShowAssign(null)}>
          <div className="space-y-3">
            <Input label="Name" value={newAssignment.name} onChange={(v) => setNewAssignment({ ...newAssignment, name: v })} placeholder="Sarah K." />
            <Input label="Email" value={newAssignment.email} onChange={(v) => setNewAssignment({ ...newAssignment, email: v })} placeholder="sarah@techfides.com" />
            <Input label="Role" value={newAssignment.role} onChange={(v) => setNewAssignment({ ...newAssignment, role: v })} placeholder="Technical Lead" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Type" value={newAssignment.type} onChange={(v) => setNewAssignment({ ...newAssignment, type: v })} options={[{ value: "FTE", label: "Full-Time" }, { value: "Contractor", label: "Contractor" }]} />
              <Select label="Region" value={newAssignment.region} onChange={(v) => setNewAssignment({ ...newAssignment, region: v })} options={[{ value: "US", label: "US" }, { value: "MX", label: "Mexico" }, { value: "GA", label: "Gabon" }]} />
            </div>
            <button onClick={() => handleAssign(showAssign)} className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">Assign to Project</button>
          </div>
        </Modal>
      )}

      {/* Add Update Modal */}
      {showUpdate && (
        <Modal title="Add Project Update" onClose={() => setShowUpdate(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Your Name" value={newUpdate.authorName} onChange={(v) => setNewUpdate({ ...newUpdate, authorName: v })} placeholder="Sarah K." />
              <Input label="Your Role" value={newUpdate.authorRole} onChange={(v) => setNewUpdate({ ...newUpdate, authorRole: v })} placeholder="Technical Lead" />
            </div>
            <Select label="Update Type" value={newUpdate.type} onChange={(v) => setNewUpdate({ ...newUpdate, type: v })} options={[
              { value: "STATUS_UPDATE", label: "\uD83D\uDCDD Status Update" },
              { value: "MILESTONE_REACHED", label: "\uD83C\uDFC1 Milestone Reached" },
              { value: "BLOCKER_REPORTED", label: "\uD83D\uDEA7 Blocker Reported" },
              { value: "HOURS_LOGGED", label: "\u23F1\uFE0F Hours Logged" },
              { value: "COMPLETED", label: "\u2705 Project Completed" },
              { value: "CLIENT_FEEDBACK", label: "\u2B50 Client Feedback" },
            ]} />
            <Input label="Title" value={newUpdate.title} onChange={(v) => setNewUpdate({ ...newUpdate, title: v })} placeholder="Completed initial deployment" />
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Details</label>
              <textarea value={newUpdate.body} onChange={(e) => setNewUpdate({ ...newUpdate, body: e.target.value })} rows={3} placeholder="What was accomplished, what's next..." className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Hours Spent" type="number" value={newUpdate.hoursSpent} onChange={(v) => setNewUpdate({ ...newUpdate, hoursSpent: v })} placeholder="4" />
              <Input label="Blockers (if any)" value={newUpdate.blockers} onChange={(v) => setNewUpdate({ ...newUpdate, blockers: v })} placeholder="Waiting on client VPN access" />
            </div>
            <button onClick={() => handleUpdate(showUpdate)} className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">Submit Update</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---- Reusable Components ----

function MC({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-100">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">{label}</label>
      <input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
