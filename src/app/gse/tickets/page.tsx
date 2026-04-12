"use client";

import { useState, useEffect, useCallback } from "react";

interface Ticket {
  id: string; subject: string; description: string; priority: string; status: string;
  category: string | null; assignedTo: string | null; assignedEmail: string | null;
  resolution: string | null; resolvedAt: string | null; hoursSpent: number | null;
  clientRating: number | null; clientAccountId: string; createdAt: string;
}

interface Client { id: string; companyName: string; contactName: string; email: string; status: string; _count: { tickets: number } }

const PRIORITY_CFG: Record<string, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10" },
  HIGH: { label: "High", color: "text-amber-400", bg: "bg-amber-500/10" },
  MEDIUM: { label: "Medium", color: "text-sky-400", bg: "bg-sky-500/10" },
  LOW: { label: "Low", color: "text-slate-400", bg: "bg-slate-500/10" },
};

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "text-red-400" },
  IN_PROGRESS: { label: "In Progress", color: "text-sky-400" },
  WAITING_CLIENT: { label: "Waiting Client", color: "text-amber-400" },
  RESOLVED: { label: "Resolved", color: "text-green-400" },
  CLOSED: { label: "Closed", color: "text-slate-400" },
};

export default function TicketsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "MEDIUM", category: "technical" });
  const [assignName, setAssignName] = useState("");
  const [assignEmail, setAssignEmail] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const cRes = await fetch("/api/v1/clients");
    const cData = await cRes.json();
    setClients(cData.clients || []);

    // Fetch tickets for all active clients
    const allTickets: Ticket[] = [];
    for (const c of (cData.clients || []) as Client[]) {
      const tRes = await fetch(`/api/v1/clients/${c.id}/tickets`);
      const tData = await tRes.json();
      for (const t of (tData.tickets || []) as Ticket[]) {
        allTickets.push(t);
      }
    }
    allTickets.sort((a, b) => {
      const po = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (po[a.priority as keyof typeof po] ?? 2) - (po[b.priority as keyof typeof po] ?? 2);
    });
    setTickets(allTickets);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  async function handleCreate() {
    if (!selectedClient) return;
    await fetch(`/api/v1/clients/${selectedClient}/tickets`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });
    setShowCreate(false);
    setNewTicket({ subject: "", description: "", priority: "MEDIUM", category: "technical" });
    fetchAll();
  }

  async function handleUpdate(ticketId: string, data: Record<string, unknown>) {
    await fetch(`/api/v1/tickets/${ticketId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchAll();
  }

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const avgResolution = (() => {
    const resolved = tickets.filter((t) => t.resolvedAt && t.createdAt);
    if (resolved.length === 0) return "N/A";
    const avgMs = resolved.reduce((s, t) => s + (new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime()), 0) / resolved.length;
    const hours = Math.round(avgMs / (1000 * 60 * 60));
    return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
  })();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-sm text-slate-400">Manage retainer client requests &mdash; assign consultants, track resolution</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">+ New Ticket</button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className={`rounded-xl border p-4 ${openCount > 0 ? "border-red-500/20 bg-red-500/5" : "border-slate-800 bg-slate-900/30"}`}><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open</p><p className={`mt-1 text-2xl font-extrabold ${openCount > 0 ? "text-red-400" : "text-slate-600"}`}>{openCount}</p></div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</p><p className="mt-1 text-2xl font-extrabold text-sky-400">{inProgressCount}</p></div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Resolution</p><p className="mt-1 text-2xl font-extrabold text-slate-100">{avgResolution}</p></div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tickets</p><p className="mt-1 text-2xl font-extrabold text-slate-100">{tickets.length}</p></div>
      </div>

      <div className="flex gap-2">
        {["all", "OPEN", "IN_PROGRESS", "WAITING_CLIENT", "RESOLVED", "CLOSED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${filter === f ? "bg-sky-500 text-white" : "border border-slate-700 text-slate-400 hover:text-white"}`}>{f === "all" ? "All" : STATUS_CFG[f]?.label || f}</button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" /></div> : filtered.length === 0 ? (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-12 text-center"><p className="text-green-400 font-semibold">No tickets {filter !== "all" ? `with status "${STATUS_CFG[filter]?.label}"` : ""}</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => {
            const pr = PRIORITY_CFG[t.priority] || PRIORITY_CFG.MEDIUM;
            const st = STATUS_CFG[t.status] || STATUS_CFG.OPEN;
            const client = clients.find((c) => c.id === t.clientAccountId);
            return (
              <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${pr.color} ${pr.bg}`}>{pr.label}</span>
                      <span className={`text-[10px] font-medium ${st.color}`}>{st.label}</span>
                      <span className="text-sm font-semibold text-slate-200">{t.subject}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">{t.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                      <span>{client?.companyName || "Unknown"}</span>
                      {t.category && <span className="rounded bg-slate-800 px-1.5 py-0.5">{t.category}</span>}
                      {t.assignedTo && <span className="text-sky-400">Assigned: {t.assignedTo}</span>}
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      {t.hoursSpent && <span>{t.hoursSpent}h spent</span>}
                    </div>
                    {t.resolution && <p className="mt-2 text-[11px] text-green-400/80 border-l-2 border-green-500/30 pl-2">{t.resolution}</p>}
                  </div>
                  <div className="ml-4 flex shrink-0 flex-col gap-1">
                    {t.status === "OPEN" && <button onClick={() => { setShowAssign(t.id); }} className="rounded px-2 py-1 text-[10px] font-semibold border border-sky-500/30 text-sky-400 hover:bg-sky-500/10">Assign</button>}
                    {t.status === "OPEN" && <button onClick={() => handleUpdate(t.id, { status: "IN_PROGRESS" })} className="rounded px-2 py-1 text-[10px] font-semibold border border-slate-700 text-slate-400 hover:text-white">Start</button>}
                    {t.status === "IN_PROGRESS" && <button onClick={() => handleUpdate(t.id, { status: "RESOLVED", resolution: "Resolved by team" })} className="rounded px-2 py-1 text-[10px] font-semibold border border-green-500/30 text-green-400 hover:bg-green-500/10">Resolve</button>}
                    {t.status === "RESOLVED" && <button onClick={() => handleUpdate(t.id, { status: "CLOSED" })} className="rounded px-2 py-1 text-[10px] font-semibold border border-slate-700 text-slate-400 hover:text-white">Close</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-slate-100">New Support Ticket</h3><button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white">&#x2715;</button></div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-300 mb-1">Client</label>
                <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
                  <option value="">Select client...</option>
                  {clients.filter((c) => c.status === "ACTIVE").map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium text-slate-300 mb-1">Subject</label><input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-300 mb-1">Description</label><textarea rows={3} value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-300 mb-1">Priority</label><select value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></select></div>
                <div><label className="block text-xs font-medium text-slate-300 mb-1">Category</label><select value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"><option value="technical">Technical</option><option value="billing">Billing</option><option value="training">Training</option><option value="feature-request">Feature Request</option></select></div>
              </div>
              <button onClick={handleCreate} className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">Create Ticket</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-slate-100">Assign Consultant</h3><button onClick={() => setShowAssign(null)} className="text-slate-400 hover:text-white">&#x2715;</button></div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-300 mb-1">Name</label><input value={assignName} onChange={(e) => setAssignName(e.target.value)} placeholder="Sarah K." className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" /></div>
              <div><label className="block text-xs font-medium text-slate-300 mb-1">Email</label><input value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} type="email" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" /></div>
              <button onClick={() => { handleUpdate(showAssign, { assignedTo: assignName, assignedEmail: assignEmail, status: "IN_PROGRESS" }); setShowAssign(null); setAssignName(""); setAssignEmail(""); }} className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">Assign & Start</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
