import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ── WhatsApp FAB ─────────────────────────────────────────────────────────────
function WhatsAppFAB() {
    const [open, setOpen] = useState(false);
    const phone = "6282123052736";
    const message = encodeURIComponent(
        "Halo E-Tourney, saya ingin bertanya tentang turnamen"
    );
    const waUrl = `https://wa.me/${phone}?text=${message}`;

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest("#wa-fab-root")) setOpen(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    return (
        <div id="wa-fab-root" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
            {open && (
                <div style={{
                    position: "absolute", bottom: 64, right: 0,
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 12, padding: "12px 16px", minWidth: 200,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}>
                    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                        Ada pertanyaan? Chat kami!
                    </p>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            fontSize: 14, fontWeight: 500, color: "#25d366",
                            textDecoration: "none", padding: "8px 12px",
                            borderRadius: 8, background: "rgba(37,211,102,0.08)",
                            border: "1px solid rgba(37,211,102,0.2)",
                        }}
                    >
                        <WaIcon size={18} />
                        Chat via WhatsApp
                    </a>
                </div>
            )}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Hubungi via WhatsApp"
                style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "#25d366", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 12px rgba(37,211,102,0.4)",
                    transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                <WaIcon size={28} color="#fff" />
            </button>
        </div>
    );
}

function WaIcon({ size = 24, color = "#25d366" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.855L.057 23.882a.5.5 0 0 0 .611.611l6.087-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.947 0-3.76-.524-5.316-1.432l-.364-.214-3.865.928.956-3.789-.234-.38A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
    );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
    return (
        <nav style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1rem 2rem",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            background: "#0a1a14",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "#1a9e75", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 16, fontWeight: 700,
                }}>E</div>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#f0faf6", letterSpacing: 1 }}>
                    E-TOURNEY
                </span>
            </div>

            <div style={{ display: "flex", gap: 24 }}>
                {["Turnamen", "Cara daftar", "Tentang"].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{
                        fontSize: 14, color: "#7ab89e", textDecoration: "none",
                        transition: "color 0.15s",
                    }}
                        onMouseEnter={(e) => (e.target.style.color = "#f0faf6")}
                        onMouseLeave={(e) => (e.target.style.color = "#7ab89e")}
                    >{item}</a>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <Link to="/login" style={{
                    fontSize: 13, padding: "7px 18px", borderRadius: 8,
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    background: "transparent", color: "#c8e6da",
                    textDecoration: "none", cursor: "pointer",
                }}>Masuk</Link>
                <Link to="/register" style={{
                    fontSize: 13, padding: "7px 18px", borderRadius: 8,
                    border: "none", background: "#1a9e75", color: "#fff",
                    fontWeight: 600, textDecoration: "none", cursor: "pointer",
                }}>Daftar gratis</Link>
            </div>
        </nav>
    );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero() {
    return (
        <section style={{
            position: "relative", padding: "5rem 2rem 4rem",
            textAlign: "center", background: "#0d1f1a", overflow: "hidden",
            borderBottom: "0.5px solid #1a3d30",
        }}>
            {/* SVG Background */}
            <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                        <polygon points="30,2 56,16 56,36 30,50 4,36 4,16" fill="none" stroke="rgba(26,158,117,0.12)" strokeWidth="1" />
                    </pattern>
                    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="rgba(26,158,117,0.18)" />
                    </pattern>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(26,158,117,0.18)" />
                        <stop offset="100%" stopColor="rgba(13,31,26,0)" />
                    </radialGradient>
                    <radialGradient id="glow2" cx="20%" cy="80%" r="40%">
                        <stop offset="0%" stopColor="rgba(26,100,200,0.08)" />
                        <stop offset="100%" stopColor="rgba(13,31,26,0)" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="#0d1f1a" />
                <rect width="100%" height="100%" fill="url(#hex)" />
                <rect width="100%" height="100%" fill="url(#dots)" />
                <rect width="100%" height="100%" fill="url(#glow)" />
                <rect width="100%" height="100%" fill="url(#glow2)" />
                <line x1="0" y1="30%" x2="100%" y2="45%" stroke="rgba(26,158,117,0.06)" strokeWidth="1" />
                <line x1="0" y1="60%" x2="100%" y2="75%" stroke="rgba(26,158,117,0.06)" strokeWidth="1" />
                <line x1="20%" y1="0" x2="35%" y2="100%" stroke="rgba(26,158,117,0.05)" strokeWidth="1" />
                <line x1="65%" y1="0" x2="80%" y2="100%" stroke="rgba(26,158,117,0.05)" strokeWidth="1" />
                <polygon points="80,20 110,10 120,40 90,50" fill="none" stroke="rgba(26,158,117,0.15)" strokeWidth="1" />
                <polygon points="580,60 620,45 635,85 595,100" fill="none" stroke="rgba(26,158,117,0.12)" strokeWidth="1" />
                <circle cx="10%" cy="25%" r="60" fill="none" stroke="rgba(26,158,117,0.08)" strokeWidth="1" />
                <circle cx="90%" cy="70%" r="80" fill="none" stroke="rgba(26,158,117,0.08)" strokeWidth="1" />
            </svg>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12, padding: "4px 12px", borderRadius: 999,
                    background: "rgba(26,158,117,0.15)", color: "#4dd6a3",
                    border: "0.5px solid rgba(26,158,117,0.35)", marginBottom: "1.5rem",
                }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4dd6a3", display: "inline-block" }} />
                    Platform turnamen game online
                </div>

                <h1 style={{
                    fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 600,
                    lineHeight: 1.25, marginBottom: "1rem", color: "#f0faf6",
                }}>
                    Atur dan ikuti turnamen<br />
                    <span style={{ color: "#1a9e75" }}>game online</span> dengan mudah
                </h1>

                <p style={{
                    fontSize: 16, color: "#7ab89e", maxWidth: 500,
                    margin: "0 auto 2rem", lineHeight: 1.7,
                }}>
                    E-Tourney memudahkan penyelenggara membuat bracket, mengelola tim,
                    dan memantau hasil turnamen secara real-time.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/tournaments" style={{
                        padding: "10px 24px", borderRadius: 8, border: "none",
                        background: "#1a9e75", color: "#fff", fontSize: 15,
                        fontWeight: 600, textDecoration: "none", cursor: "pointer",
                    }}>Lihat turnamen →</Link>
                    <a href="#cara-daftar" style={{
                        padding: "10px 24px", borderRadius: 8,
                        border: "0.5px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.05)", color: "#c8e6da",
                        fontSize: 15, textDecoration: "none", cursor: "pointer",
                    }}>Pelajari lebih lanjut</a>
                </div>
            </div>
        </section>
    );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
const STATS = [
    { num: "120+", label: "Turnamen digelar" },
    { num: "850+", label: "Tim terdaftar" },
    { num: "3.200+", label: "Pemain aktif" },
    { num: "15+", label: "Jenis game" },
];

function StatsBar() {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            borderBottom: "0.5px solid #1a3d30",
            background: "#0a1a14",
        }}>
            {STATS.map((s, i) => (
                <div key={i} style={{
                    padding: "1.5rem", textAlign: "center",
                    borderRight: i < STATS.length - 1 ? "0.5px solid #1a3d30" : "none",
                }}>
                    <div style={{ fontSize: 24, fontWeight: 600, color: "#1a9e75" }}>{s.num}</div>
                    <div style={{ fontSize: 13, color: "#7ab89e", marginTop: 4 }}>{s.label}</div>
                </div>
            ))}
        </div>
    );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
    { icon: "🏆", title: "Bracket otomatis", desc: "Generate bracket single/double elimination secara otomatis begitu pendaftaran ditutup." },
    { icon: "👥", title: "Manajemen tim", desc: "Daftarkan tim, kelola roster pemain, dan pantau performa di setiap pertandingan." },
    { icon: "💰", title: "Pembayaran terintegrasi", desc: "Kelola biaya pendaftaran dan distribusi hadiah langsung dari dashboard." },
    { icon: "📊", title: "Statistik real-time", desc: "Pantau pendaftaran, hasil match, dan pendapatan langsung dari MongoDB Atlas." },
];

function Features() {
    return (
        <section id="cara-daftar" style={{ padding: "3rem 2rem", background: "#0d1f1a" }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, textAlign: "center", color: "#f0faf6", marginBottom: 6 }}>
                Semua yang kamu butuhkan
            </h2>
            <p style={{ fontSize: 15, color: "#7ab89e", textAlign: "center", marginBottom: "2rem" }}>
                Fitur lengkap untuk penyelenggara dan peserta turnamen
            </p>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16, maxWidth: 900, margin: "0 auto",
            }}>
                {FEATURES.map((f, i) => (
                    <div key={i} style={{
                        background: "#0a1a14", border: "0.5px solid #1a3d30",
                        borderRadius: 12, padding: "1.25rem",
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 8,
                            background: "rgba(26,158,117,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 20, marginBottom: 12,
                        }}>{f.icon}</div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0faf6", marginBottom: 6 }}>{f.title}</h3>
                        <p style={{ fontSize: 13, color: "#7ab89e", lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ── Tournament Cards ──────────────────────────────────────────────────────────
function TournamentCard({ nama, game, badge, badgeColor, slots, maxSlots, tanggal, hadiah }) {
    return (
        <div style={{
            background: "#0a1a14", border: "0.5px solid #1a3d30",
            borderRadius: 12, padding: "1.25rem",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999,
                    fontWeight: 600, background: badgeColor.bg, color: badgeColor.text,
                }}>{badge}</span>
                <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999,
                    fontWeight: 600, background: "rgba(26,158,117,0.15)", color: "#4dd6a3",
                }}>Open</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f0faf6", marginBottom: 4 }}>{nama}</div>
            <div style={{ fontSize: 12, color: "#7ab89e", marginBottom: 12 }}>{game}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7ab89e" }}>
                <span>👥 {slots} / {maxSlots} tim</span>
                <span>📅 {tanggal}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a9e75", marginTop: 8 }}>
                {hadiah ? `Hadiah: ${hadiah}` : "Hadiah: —"}
            </div>
        </div>
    );
}

function Tournaments() {
    const list = [
        { nama: "It Feast Tournament", game: "Mobile Legends Bang Bang", badge: "MLBB", badgeColor: { bg: "#1e3a5f", text: "#5ba3e0" }, slots: 0, maxSlots: 8, tanggal: "6 Jun 2026", hadiah: "Rp 1.000.000" },
        { nama: "MPL ID Community", game: "Mobile Legends Bang Bang", badge: "MLBB", badgeColor: { bg: "#1e3a5f", text: "#5ba3e0" }, slots: 0, maxSlots: 9, tanggal: "13 Mei 2026", hadiah: null },
        { nama: "E-Football Champ", game: "E-Football", badge: "E-Football", badgeColor: { bg: "#3a2a1e", text: "#e09a5b" }, slots: 0, maxSlots: 6, tanggal: "13 Mei 2026", hadiah: null },
    ];

    return (
        <section id="turnamen" style={{ padding: "3rem 2rem", background: "#0d1f1a" }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, textAlign: "center", color: "#f0faf6", marginBottom: 6 }}>
                Turnamen sedang berjalan
            </h2>
            <p style={{ fontSize: 15, color: "#7ab89e", textAlign: "center", marginBottom: "2rem" }}>
                Daftar sekarang sebelum slot penuh
            </p>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16, maxWidth: 900, margin: "0 auto",
            }}>
                {list.map((t, i) => <TournamentCard key={i} {...t} />)}
            </div>
        </section>
    );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
    return (
        <section style={{
            padding: "3rem 2rem", textAlign: "center",
            background: "#0a1a14", borderTop: "0.5px solid #1a3d30",
        }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#f0faf6", marginBottom: "0.75rem" }}>
                Siap buat atau ikuti turnamen?
            </h2>
            <p style={{ color: "#7ab89e", marginBottom: "1.5rem" }}>
                Daftar gratis, tidak perlu kartu kredit.
            </p>
            <Link to="/register" style={{
                padding: "10px 28px", borderRadius: 8,
                background: "#1a9e75", color: "#fff",
                fontSize: 15, fontWeight: 600,
                textDecoration: "none", display: "inline-block",
            }}>Mulai sekarang →</Link>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer style={{
            padding: "1.5rem 2rem", textAlign: "center",
            borderTop: "0.5px solid #1a3d30",
            fontSize: 13, color: "#7ab89e", background: "#0a1a14",
        }}>
            © 2026 E-Tourney · Platform turnamen game online
        </footer>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <div style={{ minHeight: "100vh", fontFamily: "sans-serif" }}>
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
