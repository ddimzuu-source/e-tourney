import { useState, useEffect } from "react";
import api from "./api"; // Pastikan path ke file instance api.js Anda sudah benar
import { useNavigate } from "react-router-dom";
import {
  Trophy, Shield, CreditCard, Search, LogOut,
  Swords, Plus, X, Loader2, Medal, Gamepad2, Upload
} from "lucide-react";

const statusConfig = {
  open:         { label: "Open",         dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  registration: { label: "Registration", dot: "bg-cyan-400",    text: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10"    },
  ongoing:      { label: "Ongoing",      dot: "bg-violet-400",  text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/10"  },
  finished:     { label: "Selesai",      dot: "bg-gray-400",    text: "text-gray-400",    border: "border-gray-500/30",    bg: "bg-gray-500/10"    },
};

const teamStatusConfig = {
  pending:  { label: "Menunggu", text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"  },
  approved: { label: "Diterima", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  rejected: { label: "Ditolak",  text: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30"   },
};

const gameColors = {
  "Mobile Legends": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "PUBG Mobile":    "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Valorant":       "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Free Fire":      "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "E-Football":     "bg-green-500/20 text-green-400 border-green-500/30",
};

const EMPTY_TEAM_FORM = { name: "", tournament_id: "", members: "" };
const EMPTY_PAY_FORM  = { team_id: "", tournament_id: "", amount: "", payment_method: "transfer" };

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState("home");
  const [search, setSearch]             = useState("");
  const [tournaments, setTournaments]   = useState([]);
  const [myTeams, setMyTeams]           = useState([]);
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPayModal, setShowPayModal]   = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [teamForm, setTeamForm]         = useState(EMPTY_TEAM_FORM);
  const [payForm, setPayForm]           = useState(EMPTY_PAY_FORM);
  const [saving, setSaving]             = useState(false);
  const [notif, setNotif]               = useState("");
  const [currentUser, setCurrentUser]   = useState(null);

  useEffect(() => {
    api.get("/me")
      .then(res => {
        const userData = res.data?.user || res.data?.data || res.data;
        setCurrentUser(userData);
      })
      .catch(() => {
        setCurrentUser({ id: 1, name: "Peserta", role: "peserta" });
      });
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, tmRes, pRes] = await Promise.all([
        api.get("/tournaments"),
        api.get("/teams"),
        api.get("/payments"),
      ]);
      setTournaments(Array.isArray(tRes.data) ? tRes.data : tRes.data.data ?? []);
      setMyTeams(Array.isArray(tmRes.data) ? tmRes.data : tmRes.data.data ?? []);
      setPayments(Array.isArray(pRes.data) ? pRes.data : pRes.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 4000);
  };

  const handleDaftar = (t) => {
    setSelectedTournament(t);
    setTeamForm({ ...EMPTY_TEAM_FORM, tournament_id: t.id });
    setShowTeamModal(true);
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) {
      showNotif("❌ Nama tim tidak boleh kosong!");
      return;
    }
    if (!teamForm.tournament_id) {
      showNotif("❌ Turnamen belum dipilih!");
      return;
    }

    let rawCaptainId = currentUser?.id || currentUser?.user?.id || currentUser?.data?.id || 1; 

    setSaving(true);
    try {
      const cleanTournamentId = Number(teamForm.tournament_id);
      const cleanCaptainId    = Number(rawCaptainId);

      const cleanMembersArray = teamForm.members 
        ? teamForm.members.split(",").map(m => m.trim()).filter(Boolean)
        : [];

      const jsonPayload = {
        name: teamForm.name.trim(),
        tournament_id: cleanTournamentId,
        captain_id: cleanCaptainId,
        members: cleanMembersArray 
      };

      await api.post("/teams", jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      fetchAll();
      setShowTeamModal(false);
      setSelectedTournament(null);
      setTeamForm(EMPTY_TEAM_FORM); 
      showNotif("✅ Tim berhasil didaftarkan!");
    } catch (err) {
      console.warn("Mencoba Form-Data fallback...");
      try {
        const cleanTournamentId = Number(teamForm.tournament_id);
        const cleanCaptainId    = Number(rawCaptainId);
        const cleanMembersArray = teamForm.members ? teamForm.members.split(",").map(m => m.trim()).filter(Boolean) : [];

        const formData = new FormData();
        formData.append("name", teamForm.name.trim());
        formData.append("tournament_id", cleanTournamentId);
        formData.append("captain_id", cleanCaptainId);
        
        cleanMembersArray.forEach((member, index) => {
          formData.append(`members[${index}]`, member);
        });

        await api.post("/teams", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        });

        fetchAll();
        setShowTeamModal(false);
        setSelectedTournament(null);
        setTeamForm(EMPTY_TEAM_FORM); 
        showNotif("✅ Tim berhasil didaftarkan!");
      } catch (fallbackErr) {
        const validationErrors = fallbackErr.response?.data?.errors || err.response?.data?.errors;
        let errMsg = fallbackErr.response?.data?.message || fallbackErr.response?.data?.error;

        if (validationErrors) {
          const messages = Object.values(validationErrors).flat();
          errMsg = messages.join(" | ");
        }
        showNotif(errMsg ? `❌ Gagal: ${errMsg}` : "❌ Gagal mendaftarkan tim.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    setSaving(true);
    try {
      await api.post("/payments", payForm, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      fetchAll();
      setShowPayModal(false);
      showNotif("✅ Bukti pembayaran berhasil dikirim!");
    } catch (err) {
      console.error(err);
      showNotif("❌ Gagal mengirim pembayaran.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const filteredTournaments = tournaments.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.game?.toLowerCase().includes(search.toLowerCase())
  );

  const openTournaments = tournaments.filter(t => t.status === 'open' || t.status === 'registration');

  const Navbar = () => (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/95 backdrop-blur border-b border-white/5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
          <Swords size={16} className="text-[#0d0d0f]" />
        </div>
        <span className="text-white font-black tracking-wider">E<span className="text-emerald-400">-</span>TOURNEY</span>
      </div>
      <div className="flex-1 max-w-md mx-auto relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari turnamen..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {String(currentUser?.name ?? "P").slice(0,2).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">{currentUser?.name ?? "Peserta"}</p>
            <p className="text-xs text-cyan-400 capitalize">{currentUser?.role ?? "peserta"}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/5 text-gray-600 hover:text-rose-400 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );

  const BottomTab = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d0d0f]/95 backdrop-blur border-t border-white/5 flex">
      {[
        { id: "home",      label: "Beranda",   icon: Gamepad2  },
        { id: "teams",     label: "Tim Saya",  icon: Shield    },
        { id: "payments",  label: "Bayar",     icon: CreditCard },
      ].map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => setActiveTab(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${activeTab === id ? "text-emerald-400" : "text-gray-600 hover:text-gray-400"}`}>
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );

  const HomeTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-5">
        <h2 className="text-xl font-black text-white">Selamat datang, <span className="text-emerald-400">{currentUser?.name ?? "Peserta"}!</span> 👋</h2>
        <p className="text-gray-400 text-sm mt-1">Temukan turnamen dan daftarkan tim kamu sekarang.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
          <Trophy size={18} className="text-emerald-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-emerald-400">{loading ? "..." : openTournaments.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Tersedia</p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
          <Shield size={18} className="text-cyan-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-cyan-400">{loading ? "..." : myTeams.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Tim Saya</p>
        </div>
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-center">
          <Medal size={18} className="text-violet-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-violet-400">{loading ? "..." : tournaments.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTournaments.map(t => {
          const gameCls = gameColors[t.game] ?? "bg-gray-700/30 text-gray-400 border-gray-600/30";
          const canRegister = t.status === 'open' || t.status === 'registration';
          return (
            <div key={t.id} className="bg-[#111113] border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${gameCls}`}>{t.game}</span>
                </div>
                <p className="text-xs text-gray-500">Rp {Number(t.registration_fee || 0).toLocaleString("id-ID")}</p>
              </div>
              <button onClick={() => canRegister && handleDaftar(t)} disabled={!canRegister}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 disabled:opacity-30">
                Daftar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TeamsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Tim Saya</h2>
        <button onClick={() => { setTeamForm(EMPTY_TEAM_FORM); setShowTeamModal(true); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Plus size={13} /> Daftar Tim
        </button>
      </div>
      <div className="space-y-3">
        {myTeams.map(t => {
          const sc = teamStatusConfig[t.status] ?? teamStatusConfig.pending;
          return (
            <div key={t.id} className="bg-[#111113] border border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">ID Turnamen: {t.tournament_id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</span>
              </div>
              {t.status === 'approved' && (
                <button onClick={() => { setPayForm({ ...EMPTY_PAY_FORM, team_id: t.id, tournament_id: t.tournament_id }); setShowPayModal(true); }}
                  className="w-full mt-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  Upload Bukti Pembayaran
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const PaymentsTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">Riwayat Pembayaran</h2>
      <div className="space-y-3">
        {payments.map(p => (
          <div key={p.id} className="bg-[#111113] border border-white/5 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">Tim ID: {p.team_id}</p>
              <p className="text-xs text-gray-500">Metode: {p.payment_method}</p>
            </div>
            <p className="font-black text-amber-400">Rp {Number(p.amount || 0).toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Navbar />
      {notif && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm">{notif}</div>}
      <main className="pt-16 pb-20 max-w-2xl mx-auto px-4 py-6">
        {activeTab === "home"     && <HomeTab />}
        {activeTab === "teams"    && <TeamsTab />}
        {activeTab === "payments" && <PaymentsTab />}
      </main>
      <BottomTab />

      {/* Modal Daftar Tim */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white">Daftarkan Tim</h2>
              <button onClick={() => setShowTeamModal(false)} className="text-gray-500"><X size={18} /></button>
            </div>
            <input value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Nama Tim" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
            <textarea value={teamForm.members} onChange={e => setTeamForm({ ...teamForm, members: e.target.value })} placeholder="Anggota (pisahkan koma)" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm resize-none" rows={3} />
            <button onClick={handleSaveTeam} disabled={saving} className="w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-bold">Simpan</button>
          </div>
        </div>
      )}

      {/* Modal Pembayaran */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white">Upload Bukti Pembayaran</h2>
              <button onClick={() => setShowPayModal(false)} className="text-gray-500"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">ID Tim</label>
              <input value={payForm.team_id} readOnly className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Jumlah Bayar (Rp)</label>
              <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} placeholder="150000" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Metode Pembayaran</label>
              <select value={payForm.payment_method} onChange={e => setPayForm({ ...payForm, payment_method: e.target.value })} className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg p-2 text-sm">
                <option value="transfer">Transfer Bank (Manual)</option>
                <option value="gopay">GoPay (QRIS)</option>
                <option value="dana">DANA (QRIS)</option>
                <option value="ovo">OVO (QRIS)</option>
              </select>
            </div>

            {/* Area QRIS dinamis - FORMAT SUDAH .JPEG */}
            <div className="pt-2">
              {payForm.payment_method === "transfer" ? (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-xs text-gray-400">Transfer Manual ke Rekening Bank:</p>
                  <p className="text-sm font-bold text-white mt-1">BCA · 1234567890</p>
                  <p className="text-xs text-gray-500">a.n. Panitia E-Tourney</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-semibold text-amber-400 mb-2 capitalize">Scan QRIS via {payForm.payment_method}:</p>
                  <div className="w-44 h-44 bg-white p-2 rounded-lg flex items-center justify-center">
                    <img src="/images/qris.jpeg" alt="QRIS" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200?text=QRIS+Belum+Ada"; }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Silakan scan kode QR di atas, lalu kirim bukti pembayaran.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowPayModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-sm">Batal</button>
              <button onClick={handleSavePayment} disabled={saving} className="flex-1 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold">
                {saving ? "Mengirim..." : "Kirim Bukti"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}