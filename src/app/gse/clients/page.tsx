"use client";

import { useState, useEffect, useCallback } from "react";

interface Client {
  id: string; companyName: string; contactName: string; email: string; phone: string | null;
  tier: string; service: string; status: string; retainerAmount: number;
  retainerStart: string | null; deactivatedAt: string | null;
  _count: { tickets: number }; createdAt: string;
}

interface Metrics { active: number; paused: number; totalMRR: number; openTickets: number; }

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: "Active", color: "text-green-400", bg: "bg-green-500/10" },
  PAUSED: { label: "Paused", color: "text-amber-400", bg: "bg-amber-500/10" },
  DEACTIVATED: { label: "Deactivated", color: "text-slate-400", bg: "bg-slate-500/10" },
  CHURNED: { label: "Churned", color: "text-red-400", bg: "bg-red-500/10" },
};

const SERVICE_LABELS: Record<string, string> = {
  SOVEREIGN_AI: "Private AI", AI_READINESS_360: "AI Readiness 360",
  TRANSFORMATION_MANAGEMENT: "Transformation", AEGIS: "AEGIS",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newClient, setNewClient] = useState({ companyName: "", contactName: "", email: "", phone: "", tier: "Gold", service: "SOVEREIGN_AI", retainerAmount: "1000" });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = filter !== "all" ? `?status=${filter}` : "";
    const res = await fetch(`/api/v1/clients${params}`);
    const data = await res.json();
    setClients(data.clients || []);
    setMetrics(data.metrics || null);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function handleCreate() {
    await fetch("/api/v1/clients", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newClient, retainerAmount: Number(newClient.retainerAmount) }),
    });
    setShowCreate(false);
    setNewClient({ companyName: "", contactName: "", email: "", phone: "", tier: "Gold", service: "SOVEREIGN_AI", retainerAmount: "1000" });
    fetch_();
  }

  async function handleStatus(id: string, status: string) {
    await fetch(`/api/v1/clients/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetch_();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Accounts</h1>
          <p className="text-sm text-slate-400">Manage retainer clients &mdash; activate, pause, or deactivate accounts</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">+ New Client</button>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MC label="Active Clients" value={String(metrics.active)} good />
          <MC label="Paused" value={String(metrics.paused)} />
          <MC label="Monthly Retainer Revenue" value={`$${metrics.totalMRR.toLocaleString()}`} good />
          <MC label="Open Tickets" value={String(metrics.openTickets)} warn={metrics.openTickets > 0} />
        </div>
      )}

      <div className="flex gap-2">
        {["all", "ACTIVE", "PAUSED", "DEACTIVATED", "CHURNED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${filter === f ? "bg-sky-500 text-white" : "border border-slate-700 text-slate-400 hover:text-white"}`}>{f === "all" ? "All" : STATUS_CFG[f]?.label || f}</button>
        ))}
      </div>

      {loading ? <Spin /> : clients.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center"><p className="text-slate-400">No clients found</p></div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Company</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Contact</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Tier / Service</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Retainer</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Tickets</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Status</th>
                <th className="p-3 text-left text-[10px] font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {clients.map((c) => {
                const st = STATUS_CFG[c.status] || STATUS_CFG.ACTIVE;
                return (
                  <tr key={c.id} className="hover:bg-slate-900/30">
                    <td className="p-3 text-xs font-medium text-slate-200">{c.companyName}</td>
                    <td className="p-3 text-xs text-slate-400">{c.contactName}<br /><span className="text-[10px]">{c.email}</span></td>
                    <td className="p-3 text-xs text-slate-400">{c.tier} &middot; {SERVICE_LABELS[c.service] || c.service}</td>
                    <td className="p-3 text-xs font-semibold text-slate-200">${c.retainerAmount.toLocaleString()}/mo</td>
                    <td className="p-3 text-xs text-slate-400">{c._count.tickets}</td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.color} ${st.bg}`}>{st.label}</span></td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {c.status === "ACTIVE" && <Btn label="Pause" onClick={() => handleStatus(c.id, "PAUSED")} color="amber" />}
                        {c.status === "ACTIVE" && <Btn label="Deactivate" onClick={() => handleStatus(c.id, "DEACTIVATED")} color="red" />}
                        {c.status === "PAUSED" && <Btn label="Activate" onClick={() => handleStatus(c.id, "ACTIVE")} color="green" />}
                        {c.status === "PAUSED" && <Btn label="Deactivate" onClick={() => handleStatus(c.id, "DEACTIVATED")} color="red" />}
                        {c.status === "DEACTIVATED" && <Btn label="Reactivate" onClick={() => handleStatus(c.id, "ACTIVE")} color="green" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-slate-100">New Client Account</h3><button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white">&#x2715;</button></div>
            <div className="space-y-3">
              <In label="Company Name" value={newClient.companyName} onChange={(v) => setNewClient({ ...newClient, companyName: v })} />
              <div className="grid grid-cols-2 gap-3">
                <In label="Contact Name" value={newClient.contactName} onChange={(v) => setNewClient({ ...newClient, contactName: v })} />
                <In label="Email" value={newClient.email} onChange={(v) => setNewClient({ ...newClient, email: v })} type="email" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Sel label="Tier" value={newClient.tier} onChange={(v) => setNewClient({ ...newClient, tier: v })} options={["Silver", "Gold", "Platinum"]} />
                <Sel label="Service" value={newClient.service} onChange={(v) => setNewClient({ ...newClient, service: v })} options={Object.keys(SERVICE_LABELS)} />
                <In label="Retainer $/mo" value={newClient.retainerAmount} onChange={(v) => setNewClient({ ...newClient, retainerAmount: v })} type="number" />
              </div>
              <button onClick={handleCreate} className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400">Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MC({ label, value, good, warn }: { label: string; value: string; good?: boolean; warn?: boolean }) {
  return (<div className={`rounded-xl border p-4 ${good ? "border-green-500/20 bg-green-500/5" : warn ? "border-amber-500/20 bg-amber-500/5" : "border-slate-800 bg-slate-900/30"}`}><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className={`mt-1 text-2xl font-extrabold ${good ? "text-green-400" : warn ? "text-amber-400" : "text-slate-100"}`}>{value}</p></div>);
}

function Btn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  const cls = color === "green" ? "text-green-400 border-green-500/30 hover:bg-green-500/10" : color === "red" ? "text-red-400 border-red-500/30 hover:bg-red-500/10" : "text-amber-400 border-amber-500/30 hover:bg-amber-500/10";
  return <button onClick={onClick} className={`rounded px-2 py-1 text-[10px] font-semibold border ${cls}`}>{label}</button>;
}

function In({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (<div><label className="block text-xs font-medium text-slate-300 mb-1">{label}</label><input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none" /></div>);
}

function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (<div><label className="block text-xs font-medium text-slate-300 mb-1">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">{options.map((o) => <option key={o} value={o}>{SERVICE_LABELS[o] || o}</option>)}</select></div>);
}

function Spin() { return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" /></div>; }
