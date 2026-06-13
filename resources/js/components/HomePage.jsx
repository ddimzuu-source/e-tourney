import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    Trophy, BookOpen, Info, LogIn, Swords, 
    Gamepad2, Users, UserCheck, Flame, Wallet, BarChart3, 
    Menu, X, MessageCircle 
} from "lucide-react";

// ── WhatsApp FAB ─────────────────────────────────────────────────────────────
function WhatsAppFAB() {
    const [open, setOpen] = useState(false);
    const phone = "6282123052736";
    const message = encodeURIComponent("Halo E-Tourney, saya ingin bertanya tentang turnamen");
    const waUrl = `https://wa.me/${phone}?text=${message}`;

    // Tutup popup kalau user klik di luar area FAB
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest("#wa-fab-root")) setOpen(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    return (
        <div id="wa-fab-root" className="fixed bottom-6 right-6 z-50">
            {/* Tooltip Chat */}
            <div className={`absolute bottom-16 right-0 bg-white border border-gray-200 rounded-xl p-3 min-w-[200px] shadow-xl transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
                <p className="text-xs text-gray-500 mb-2 font-medium">Ada pertanyaan? Chat kami!</p>
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-[#25d366] bg-[#25d366]/10 border border-[#25d366]/20 py-2 px-3 rounded-lg hover:bg-[#25d366]/20 transition-colors"
                >
                    <MessageCircle size={18} />
                    Chat via WhatsApp
                </a>
            </div>
            
            {/* Tombol Utama */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-200 active:scale-95"
            >
                {open ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Efek shadow & blur saat halaman di-scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0a1a14]/90 backdrop-blur-md border-b border-white/10 py-3' : 'bg-[#0a1a14] border-b border-white/5 py-4'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                
                {/* Logo E-TOURNEY */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                        <Swords size={18} />
                    </div>
                    <span className="text-base font-bold text-white tracking-wider">
                        E-TOURNEY
                    </span>
                </div>

                {/* Menu Navigasi Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#turnamen" className="flex items-center gap-2 text-sm text-emerald-300/70 hover:text-white transition-colors">
                        <Trophy size={14} /> Turnamen
                    </a>
                    <a href="#fitur" className="flex items-center gap-2 text-sm text-emerald-300/70 hover:text-white transition-colors">
                        <BookOpen size={14} /> Cara daftar
                    </a>
                    <a href="#fitur" className="flex items-center gap-2 text-sm text-emerald-300/70 hover:text-white transition-colors">
                        <Info size={14} /> Tentang
                    </a>
                </div>

                {/* Tombol Aksi Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 text-emerald-100 hover:bg-white/5 transition-colors">
                        <LogIn size={14} /> Masuk
                    </Link>
                    <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
                        Daftar gratis
                    </Link>
                </div>

                {/* Hamburger Button Mobile */}
                <button 
                    className="md:hidden text-emerald-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Menu Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a1a14] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
                    <a href="#turnamen" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-emerald-300/80 hover:text-white p-2 rounded-lg hover:bg-white/5">
                        <Trophy size={18} /> Turnamen
                    </a>
                    <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-emerald-300/80 hover:text-white p-2 rounded-lg hover:bg-white/5">
                        <BookOpen size={18} /> Cara daftar
                    </a>
                    <div className="h-px w-full bg-white/10 my-2"></div>
                    <Link to="/login" className="flex justify-center items-center gap-2 text-sm p-3 rounded-lg border border-white/10 text-emerald-100 hover:bg-white/5">
                        <LogIn size={16} /> Masuk
                    </Link>
                    <Link to="/register" className="flex justify-center items-center text-sm p-3 rounded-lg bg-emerald-500 text-white font-semibold">
                        Daftar gratis
                    </Link>
                </div>
            )}
        </nav>
    );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 text-center bg-[#0d1f1a] overflow-hidden border-b border-[#1a3d30]">
            {/* SVG Background Ornamen */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,158,117,0.1)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 text-xs py-1.5 px-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Platform turnamen game online
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white tracking-tight">
                    Atur dan ikuti turnamen <br className="hidden md:block"/>
                    <span className="text-emerald-500 inline-block drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">game online</span> dengan mudah
                </h1>

                <p className="text-base md:text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                    E-Tourney memudahkan penyelenggara membuat bracket, mengelola tim, 
                    dan memantau hasil turnamen secara real-time.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#turnamen" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-transform active:scale-95">
                        Lihat turnamen →
                    </a>
                    <a href="#fitur" className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-emerald-100 font-semibold transition-colors">
                        Pelajari sistem
                    </a>
                </div>
            </div>
        </section>
    );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
const STATS = [
    { num: "120+", label: "Turnamen digelar", icon: Gamepad2 },
    { num: "850+", label: "Tim terdaftar", icon: Users },
    { num: "3.200+", label: "Pemain aktif", icon: UserCheck },
    { num: "15+", label: "Jenis game", icon: Flame },
];

function StatsBar() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#1a3d30] bg-[#0a1a14]">
            {STATS.map((s, i) => (
                <div key={i} className={`p-6 text-center flex flex-col items-center justify-center ${i % 2 !== 0 ? '' : 'border-r border-[#1a3d30]'} md:border-r border-[#1a3d30] last:border-r-0 hover:bg-white/[0.02] transition-colors`}>
                    <s.icon size={24} className="text-emerald-500 mb-3 opacity-80" />
                    <div className="text-2xl md:text-3xl font-black text-emerald-500 mb-1">{s.num}</div>
                    <div className="text-xs md:text-sm font-medium text-emerald-200/60 uppercase tracking-wider">{s.label}</div>
                </div>
            ))}
        </div>
    );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
    { icon: Trophy, title: "Bracket otomatis", desc: "Generate bracket single/double elimination secara otomatis begitu pendaftaran ditutup." },
    { icon: Users, title: "Manajemen tim", desc: "Daftarkan tim, kelola roster pemain, dan pantau performa di setiap pertandingan." },
    { icon: Wallet, title: "Pembayaran terintegrasi", desc: "Kelola biaya pendaftaran via QRIS dan distribusi hadiah langsung dari dashboard." },
    { icon: BarChart3, title: "Statistik real-time", desc: "Pantau pendaftaran, hasil match, dan riwayat kemenangan langsung dari database." },
];

function Features() {
    return (
        <section id="fitur" className="py-20 px-6 bg-[#0d1f1a]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">Semua yang kamu butuhkan</h2>
                    <p className="text-emerald-200/60 text-lg">Fitur lengkap untuk kelancaran turnamen E-Sports</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="bg-[#0a1a14] border border-[#1a3d30] rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-[#0f241d] transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                                <f.icon size={24} className="text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-emerald-100/60 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Tournament Cards ──────────────────────────────────────────────────────────
function Tournaments() {
    // Data dummy sementara (Nanti akan diganti dengan data fetch dari API)
    const list = [
        { nama: "It Feast Tournament", game: "Mobile Legends Bang Bang", badge: "MLBB", badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20", slots: 6, maxSlots: 8, tanggal: "6 Jun 2026", hadiah: "Rp 1.000.000" },
        { nama: "MPL ID Community", game: "Mobile Legends Bang Bang", badge: "MLBB", badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20", slots: 9, maxSlots: 9, tanggal: "13 Mei 2026", hadiah: null },
        { nama: "E-Football Champ", game: "E-Football", badge: "E-Football", badgeColor: "bg-orange-500/10 text-orange-400 border border-orange-500/20", slots: 2, maxSlots: 6, tanggal: "13 Mei 2026", hadiah: null },
    ];

    return (
        <section id="turnamen" className="py-20 px-6 bg-[#0a1a14] border-t border-[#1a3d30]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Turnamen Terbaru</h2>
                        <p className="text-emerald-200/60">Daftarkan timmu sekarang sebelum slot penuh!</p>
                    </div>
                    <Link to="/tournaments" className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center gap-1 group">
                        Lihat Semua <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((t, i) => {
                        const isFull = t.slots >= t.maxSlots;
                        return (
                            <div key={i} className="bg-[#0d1f1a] border border-[#1a3d30] rounded-2xl p-6 flex flex-col hover:border-emerald-500/40 transition-colors">
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 uppercase rounded-md ${t.badgeColor}`}>
                                        {t.badge}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${isFull ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                        {isFull ? 'Penuh' : 'Open'}
                                    </span>
                                </div>
                                
                                {/* Info Turnamen */}
                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{t.nama}</h3>
                                <p className="text-sm text-emerald-100/50 mb-6">{t.game}</p>
                                
                                {/* Detail Metriks */}
                                <div className="mt-auto space-y-3 bg-[#0a1a14] p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center text-xs font-medium">
                                        <span className="text-emerald-100/50 flex items-center gap-1.5"><Users size={14}/> Slot Tim</span>
                                        <span className="text-white">{t.slots} / {t.maxSlots}</span>
                                    </div>
                                    {/* Progress Bar Slot */}
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${(t.slots / t.maxSlots) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-medium pt-2">
                                        <span className="text-emerald-100/50">Mulai</span>
                                        <span className="text-white">{t.tanggal}</span>
                                    </div>
                                </div>

                                {/* Tombol Action */}
                                <button disabled={isFull} className={`w-full mt-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isFull ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-white active:scale-95'}`}>
                                    {isFull ? 'Pendaftaran Tutup' : 'Daftar Sekarang'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
    return (
        <section className="py-20 px-6 text-center bg-[#0d1f1a] border-t border-[#1a3d30]">
            <div className="max-w-2xl mx-auto bg-gradient-to-b from-emerald-500/10 to-transparent p-10 rounded-3xl border border-emerald-500/20">
                <Trophy size={48} className="mx-auto text-emerald-400 mb-6" />
                <h2 className="text-3xl font-black text-white mb-4">Siap menjemput kemenanganmu?</h2>
                <p className="text-emerald-100/70 mb-8 max-w-md mx-auto">
                    Bergabunglah dengan ribuan pemain lainnya. Buat timmu, ikuti turnamen, dan buktikan siapa yang terbaik!
                </p>
                <Link to="/register" className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 inline-flex items-center gap-2">
                    Daftar Sekarang Gratis <UserCheck size={18} />
                </Link>
            </div>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="py-8 px-6 text-center border-t border-[#1a3d30] bg-[#0a1a14]">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Swords size={20} className="text-emerald-500" />
                <span className="text-lg font-bold text-white tracking-wider">E-TOURNEY</span>
            </div>
            <p className="text-sm text-emerald-100/50">
                © {new Date().getFullYear()} E-Tourney. Platform manajemen turnamen game online profesional.
            </p>
        </footer>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <div className="min-h-screen font-sans bg-[#0d1f1a] selection:bg-emerald-500/30">
            <Navbar />
            <Hero />
            <StatsBar />
            <Features />
            <Tournaments />
            <CTA />
            <Footer />
            <WhatsAppFAB />
        </div>
    );
}