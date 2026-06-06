import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Plus, Eye, Edit3, Trash2, X, Save,
  Loader2, Search, ChevronLeft, Swords, LayoutDashboard,
  Shield, CreditCard, Users, Settings, LogOut, Menu
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

const statusConfig = {
  open:         { label: "Open",         dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  registration: { label: "Registration", dot: "bg-cyan-400",    text: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10"    },
  ongoing:      { label: "Ongoing",      dot: "bg-violet-400",  text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/10"  },
  finished:     { label: "Finished",     dot: "bg-gray-400",    text: "text-gray-400",    border: "border-gray-500/30",    bg: "bg-gray-500/10"    },
};

const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const EMPTY_FORM = {
  name: "", game: "", game_tag: "", max_teams: "",
  registration_fee: "", prize: "", start_date: "",
  end_date: "", status: "open", description: "",
};

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editData, setEditData]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);

  // Fetch tournaments
  const fetchTournaments = () => {
    setLoading(true);
    axios.get(`${API_BASE}/tournaments`)
      .then(res => setTournaments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTournaments(); }, []);

  const filtered = tournaments.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.game?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setEditData(null); setShowModal(true); };
  const openEdit   = (t) => { setForm({ ...EMPTY_FORM, ...t }); setEditData(t); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditData(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editData) {
        await axios.put(`${API_BASE}/tournaments/${editData.id}`, form);
      } else {
        await axios.post(`${API_BASE}/tournaments`, form);
      }
      fetchTournaments();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tournaments/${id}`);
      fetchTournaments();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const Sidebar = () => (
    <aside className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0d0d0f] border-r border-white/5 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 shrink-0">
          <Swords size={16} className="text-[#0d0d0f]" />
        </div>
        {sidebarOpen && <span className="text-white font-black tracking-wider text-lg">E<span className="text-emerald-400">-</span>TOURNEY</span>}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === "/tournaments";
          return (
            <button key={id} onClick={() => navigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent"}`}>
              {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-400 rounded-full" />}
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">AD</div>
          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Admin Utama</p>
                <p className="text-xs text-emerald-400">Administrator</p>
              </div>
              <button className="text-gray-600 hover:text-rose-400 p-1"><LogOut size={15} /></button>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Sidebar />

      {/* Header */}
      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
          <Menu size={20} />
        </button>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari turnamen..."
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <button onClick={openCreate}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all active:scale-95">
          <Plus size={15} /> Buat Turnamen
        </button>
      </header>

      {/* Main */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6 max-w-screen-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Manajemen <span className="text-emerald-400">Turnamen</span></h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} turnamen ditemukan</p>
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                <Loader2 size={20} className="animate-spin" /><span>Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                <p>Belum ada turnamen</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Nama Turnamen", "Game", "Slot", "Biaya Daftar", "Hadiah", "Status", "Aksi"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map(t => {
                      const sc = statusConfig[t.status] ?? statusConfig.open;
                      return (
                        <tr key={t.id} className="hover:bg-white/[0.025] transition-colors group">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{t.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">Mulai: {t.start_date}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-300">{t.game}</td>
                          <td className="px-5 py-4">
                            <span className="text-white font-semibold">{t.slots_used ?? 0}/{t.max_teams}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            Rp {Number(t.registration_fee || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-5 py-4 text-gray-300">{t.prize ?? "-"}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-amber-400 transition-colors" title="Edit">
                                <Edit3 size={15} />
                              </button>
                              <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-rose-400 transition-colors" title="Hapus">
                                <Trash2 size={15} />
                              </button>
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

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editData ? "Edit Turnamen" : "Buat Turnamen Baru"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nama Turnamen", key: "name", type: "text", placeholder: "MLBB Pro League" },
                { label: "Game", key: "game", type: "text", placeholder: "Mobile Legends" },
                { label: "Game Tag", key: "game_tag", type: "text", placeholder: "MLBB" },
                { label: "Max Tim", key: "max_teams", type: "number", placeholder: "32" },
                { label: "Biaya Pendaftaran (Rp)", key: "registration_fee", type: "number", placeholder: "150000" },
                { label: "Hadiah", key: "prize", type: "text", placeholder: "Rp 10.000.000" },
                { label: "Tanggal Mulai", key: "start_date", type: "date" },
                { label: "Tanggal Selesai", key: "end_date", type: "date" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
                  <input type={type} value={form[key] ?? ""} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                  <option value="open">Open</option>
                  <option value="registration">Registration</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Deskripsi</label>
                <textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Deskripsi turnamen..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-white/5">
              <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-colors">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 size={40} className="mx-auto mb-3 text-rose-400" />
            <h2 className="text-lg font-bold text-white mb-2">Hapus Turnamen?</h2>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm font-semibold">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
