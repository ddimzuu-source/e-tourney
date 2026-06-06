import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swords, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import api from "./api";

const FAKE_USERS = [
  { email: "admin@etourney.com",   password: "admin123",   token: "fake-token-admin-001",   user: { id: 1, name: "Admin Utama",      email: "admin@etourney.com",   role: "admin"   } },
  { email: "panitia@etourney.com", password: "panitia123", token: "fake-token-panitia-002", user: { id: 2, name: "Panitia Turnamen", email: "panitia@etourney.com", role: "panitia" } },
   { email: "user@etourney.com",    password: "user123",    token: "fake-token-user-003",    user: { id: 3, name: "User Peserta",     email: "user@etourney.com",    role: "peserta" } },
];

const DEMO_ACCOUNTS = [
  { role: "Admin",   email: "admin@etourney.com",   password: "admin123",   color: "text-amber-400",  border: "border-amber-500/20",  bg: "bg-amber-500/5"  },
  { role: "Panitia", email: "panitia@etourney.com", password: "panitia123", color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5" },
  { role: "User",    email: "user@etourney.com",    password: "user123",    color: "text-sky-400",    border: "border-sky-500/20",    bg: "bg-sky-500/5"    },
];

// VITE_DEMO_MODE=true  → pakai fake auth (untuk presentasi)
// VITE_DEMO_MODE=false → pakai API nyata (production)
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);
    setError("");
    try {
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 800));
        const match = FAKE_USERS.find((u) => u.email === form.email && u.password === form.password);
        if (!match) throw { isDemoError: true };
        localStorage.setItem("auth_token", match.token);
        localStorage.setItem("auth_user", JSON.stringify(match.user));
      } else {
        const res = await api.post("/login", form);
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      }
      navigate("/");
    } catch (err) {
      if (err.isDemoError)                  setError("Email atau password salah.");
      else if (err.response?.status === 422) setError(err.response.data.errors?.email?.[0] ?? "Email atau password salah.");
      else if (err.response?.status === 401) setError("Email atau password salah.");
      else                                   setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => { setForm({ email: account.email, password: account.password }); setError(""); };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAwIDQwIEwgNDAgMCBNIC0xMCA0MCBMIDQwIC0xMCBNIDAgNTAgTCA1MCAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4 shadow-lg shadow-emerald-500/20">
            <Swords size={28} className="text-[#0a0a0c]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">E<span className="text-emerald-400">-</span>TOURNEY</h1>
          <p className="text-gray-500 text-sm mt-1">Platform Manajemen Turnamen E-Sport</p>
        </div>

        <div className="bg-[#111113] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Masuk ke Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">{DEMO_MODE ? "Pilih akun demo atau isi manual" : "Gunakan akun Admin atau Panitia"}</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm mb-5">
              <AlertCircle size={16} className="shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="admin@etourney.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors p-1">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-[#0a0a0c] font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Memverifikasi...</> : "Masuk"}
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-gray-600">{DEMO_MODE ? "Akun Demo — klik untuk autofill" : "Info"}</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map(({ role, email, password, color, border, bg }) => (
              DEMO_MODE ? (
                <button key={role} type="button" onClick={() => fillDemo({ email, password })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg ${bg} border ${border} hover:opacity-80 transition-opacity text-left`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${color}`}>{role}</span>
                    <span className="text-xs text-gray-600">{email}</span>
                  </div>
                  <span className="text-xs text-gray-600 font-mono">{password}</span>
                </button>
              ) : (
                <div key={role} className={`flex items-center justify-between px-3 py-2 rounded-lg ${bg} border ${border}`}>
                  <span className={`text-xs font-semibold ${color}`}>{role}</span>
                  <span className="text-xs text-gray-600">Akses penuh ke dashboard</span>
                </div>
              )
            ))}
          </div>
        </div>

        {DEMO_MODE && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">⚡ Demo Mode</span>
            <span className="text-xs text-gray-700">Tidak terhubung ke server</span>
          </div>
        )}
        <p className="text-center text-xs text-gray-700 mt-4">E-Tourney © {new Date().getFullYear()} · Platform Manajemen Turnamen E-Sport</p>
      </div>
    </div>
  );
}
