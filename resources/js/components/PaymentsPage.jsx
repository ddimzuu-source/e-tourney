import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import api from "./api";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, CheckCircle, XCircle, Clock, Loader2,
  Search, Swords, Trophy, LayoutDashboard, Shield,
  Users, Settings, LogOut, Menu, Eye, X, ImageIcon
} from "lucide-react";


const STORAGE_BASE = "http://127.0.0.1:8000/storage";

const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const statusConfig = {
  pending:  { label: "Pending",  icon: Clock,       text: "text-amber-400",   border: "border-amber-500/30",   bg: "bg-amber-500/10"  },
  paid:     { label: "Paid",     icon: CheckCircle, text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  rejected: { label: "Rejected", icon: XCircle,     text: "text-rose-400",    border: "border-rose-500/30",    bg: "bg-rose-500/10"   },
};

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewData, setViewData]         = useState(null);
  const [notif, setNotif]               = useState("");

  const fetchPayments = () => {
    setLoading(true);
    api.get(`/payments`)
      .then(res => setPayments(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 3000);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/payments/${id}`, { status });
      fetchPayments();
      setViewData(prev => prev ? { ...prev, status } : null);
      showNotif(status === "paid" ? "✅ Pembayaran dikonfirmasi!" : "❌ Pembayaran ditolak.");
    } catch (err) {
      console.error(err);
      showNotif("❌ Gagal update status.");
    }
  };

  const filtered = payments.filter(p => {
    const matchSearch = String(p.team_id ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        String(p.tournament_id ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPaid    = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === "pending").length;

 

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Sidebar open={sidebarOpen} />

      {/* Notif */}
      {notif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm shadow-xl">
          {notif}
        </div>
      )}

      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Menu size={20} /></button>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pembayaran..."
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {["all", "pending", "paid", "rejected"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${filterStatus === s ? "bg-amber-500/20 border border-amber-500/30 text-amber-400" : "text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/5"}`}>
              {s === "all" ? "Semua" : s}
              {s === "pending" && totalPending > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-[#0a0a0c] text-[10px] font-black">{totalPending}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6 max-w-screen-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Manajemen <span className="text-amber-400">Pembayaran</span></h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} transaksi ditemukan</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#111113] border border-emerald-500/20 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Terkonfirmasi</p>
              <p className="text-xl font-black text-emerald-400">Rp {totalPaid.toLocaleString("id-ID")}</p>
            </div>
            <div className="bg-[#111113] border border-amber-500/20 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Menunggu Konfirmasi</p>
              <p className="text-xl font-black text-amber-400">{totalPending} transaksi</p>
            </div>
            <div className="bg-[#111113] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Transaksi</p>
              <p className="text-xl font-black text-white">{payments.length}</p>
            </div>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                <Loader2 size={20} className="animate-spin" /><span>Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
                <p>Belum ada pembayaran</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Tim", "Turnamen", "Jumlah", "Metode", "Bukti", "Status", "Tanggal", "Aksi"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map(p => {
                      const sc = statusConfig[p.status] ?? statusConfig.pending;
                      const StatusIcon = sc.icon;
                      return (
                        <tr key={p.id || p._id} className="hover:bg-white/[0.025] transition-colors group">
                          <td className="px-5 py-4 font-semibold text-white">{p.team_id ?? "-"}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs max-w-[120px] truncate">{p.tournament_id ?? "-"}</td>
                          <td className="px-5 py-4 text-white font-semibold">Rp {Number(p.amount || 0).toLocaleString("id-ID")}</td>
                          <td className="px-5 py-4 text-gray-300 capitalize">{p.payment_method ?? "-"}</td>
                          <td className="px-5 py-4">
                            {p.proof ? (
                              <a href={`${STORAGE_BASE}/${p.proof}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                                <ImageIcon size={13} /> Lihat
                              </a>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.text}`}>
                              <StatusIcon size={11} />{sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-xs">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString("id-ID") : "-"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setViewData(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-cyan-400 transition-colors" title="Detail">
                                <Eye size={15} />
                              </button>
                              {p.status === "pending" && (
                                <>
                                  <button onClick={() => handleUpdateStatus(p.id || p._id, "paid")} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-emerald-400 transition-colors" title="Konfirmasi">
                                    <CheckCircle size={15} />
                                  </button>
                                  <button onClick={() => handleUpdateStatus(p.id || p._id, "rejected")} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-rose-400 transition-colors" title="Tolak">
                                    <XCircle size={15} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Detail Pembayaran */}
      {viewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Detail Pembayaran</h2>
              <button onClick={() => setViewData(null)} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3">

              {/* Bukti Transfer */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Bukti Transfer</p>
                {viewData.proof ? (
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={`${STORAGE_BASE}/${viewData.proof}`}
                      alt="Bukti Transfer"
                      className="w-full max-h-64 object-contain bg-black"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none' }} className="h-32 items-center justify-center text-gray-500 text-sm gap-2">
                      <ImageIcon size={20} /> Gambar tidak dapat dimuat
                    </div>
                    <a
                      href={`${STORAGE_BASE}/${viewData.proof}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block text-center py-2 text-xs text-cyan-400 hover:text-cyan-300 border-t border-white/5"
                    >
                      Buka di tab baru ↗
                    </a>
                  </div>
                ) : (
                  <div className="h-24 rounded-xl border border-white/10 flex items-center justify-center text-gray-600 text-sm gap-2">
                    <ImageIcon size={16} /> Tidak ada bukti transfer
                  </div>
                )}
              </div>

              {/* Info Pembayaran */}
              {[
                { label: "ID Transaksi", value: viewData.id || viewData._id },
                { label: "ID Tim",       value: viewData.team_id },
                { label: "ID Turnamen",  value: viewData.tournament_id },
                { label: "Jumlah",       value: `Rp ${Number(viewData.amount || 0).toLocaleString("id-ID")}` },
                { label: "Metode",       value: viewData.payment_method },
                { label: "Status",       value: viewData.status },
                { label: "Tanggal",      value: viewData.created_at ? new Date(viewData.created_at).toLocaleString("id-ID") : "-" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-sm text-white font-medium max-w-[200px] truncate text-right">{value ?? "-"}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            {viewData.status === "pending" && (
              <div className="flex gap-3 px-6 py-4 border-t border-white/5">
                <button onClick={() => handleUpdateStatus(viewData.id || viewData._id, "rejected")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/30 transition-colors">
                  <XCircle size={15} /> Tolak
                </button>
                <button onClick={() => handleUpdateStatus(viewData.id || viewData._id, "paid")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle size={15} /> Konfirmasi
                </button>
              </div>
            )}
            {viewData.status !== "pending" && (
              <div className="px-6 py-4 border-t border-white/5">
                <div className={`text-center py-2 rounded-lg text-sm font-semibold ${viewData.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {viewData.status === "paid" ? "✅ Sudah dikonfirmasi" : "❌ Sudah ditolak"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
