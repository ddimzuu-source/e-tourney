import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  ChevronLeft, Loader2, Trophy, Swords, 
  Calendar, Users, AlertTriangle, RefreshCw 
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function TournamentBracketPage() {
  const { id } = useParams(); // Mengambil ID dari URL React Router
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi ambil data bracket & detail turnamen
  const fetchBracketData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Ambil data bagan/pertandingan dari Challonge via Laravel
      const bracketRes = await axios.get(`${API_BASE}/tournaments/${id}/bracket`);
      setMatches(bracketRes.data);

      // 2. Ambil detail info turnamennya sekalian buat nama/header (opsional)
      const infoRes = await axios.get(`${API_BASE}/tournaments/${id}`);
      setTournament(infoRes.data);
    } catch (err) {
      console.error("Error fetching bracket:", err);
      setError(
        err.response?.data?.message || 
        "Gagal memuat bagan pertandingan. Pastikan bracket sudah digenerate di Challonge."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracketData();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Tombol Kembali & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/tournaments")}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Kembali ke Manajemen Turnamen"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Swords size={12} /> Bagan Pertandingan
              </div>
              <h1 className="text-2xl font-black text-white">
                {tournament?.name || "Loading Tournament..."}
              </h1>
            </div>
          </div>

          {/* Tombol Refresh Data */}
          <button 
            onClick={fetchBracketData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold text-gray-300 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Sync Bagan
          </button>
        </div>

        {/* Info Singkat Turnamen */}
        {tournament && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-[#111113] border border-white/5 rounded-xl p-4 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-300"><Trophy size={16} /></div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Game</p>
                <p className="font-semibold text-gray-200">{tournament.game}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-300"><Users size={16} /></div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Slot Tim</p>
                <p className="font-semibold text-gray-200">{tournament.slots_used ?? 0} / {tournament.max_teams} Terdaftar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-300"><Calendar size={16} /></div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Tanggal Mulai</p>
                <p className="font-semibold text-gray-200">{tournament.start_date || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Konten Utama Bagan */}
        <div className="bg-[#111113] border border-white/5 rounded-xl min-h-[400px] flex flex-col items-center justify-center p-6 overflow-x-auto">
          
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-emerald-400" />
              <span className="text-sm">Menghubungkan ke Challonge API...</span>
            </div>
          ) : error ? (
            <div className="text-center max-w-md py-10">
              <AlertTriangle size={40} className="mx-auto mb-3 text-amber-500 opacity-80" />
              <p className="text-sm text-gray-400 font-medium">{error}</p>
              <p className="text-xs text-gray-600 mt-2">
                Pastikan status turnamen sudah di-start atau tim pendaftar sudah di-shuffle di backend Laravel.
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Swords size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Belum ada pertandingan yang terbentuk.</p>
              <p className="text-xs text-gray-600 mt-1">Generate struktur babak/bracket terlebih dahulu melalui panel admin.</p>
            </div>
          ) : (
            
            /* AREA RENDER STRUKTUR BAGAN (MAPPING MATCHES) */
            <div className="w-full flex items-start justify-center gap-12 py-8 min-w-[800px]">
              {/* Contoh visual mapping match sederhana, sesuaikan dengan skema array data Challonge lu */}
              <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
                {matches.map((match, idx) => (
                  <div 
                    key={match.id || idx} 
                    className="bg-[#161619] border border-white/5 rounded-lg p-4 w-full max-w-sm mx-auto shadow-lg relative group hover:border-emerald-500/30 transition-all"
                  >
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d0d0f] border border-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {idx + 1}
                    </div>
                    
                    {/* Tim 1 */}
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-2">
                      <span className={`text-sm font-medium ${match.player1_is_winner ? "text-emerald-400 font-bold" : "text-gray-300"}`}>
                        {match.player1_name || "TBD (To Be Decided)"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-gray-400">
                        {match.player1_score ?? "-"}
                      </span>
                    </div>

                    {/* Tim 2 */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${match.player2_is_winner ? "text-emerald-400 font-bold" : "text-gray-300"}`}>
                        {match.player2_name || "TBD (To Be Decided)"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-gray-400">
                        {match.player2_score ?? "-"}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/[0.02] flex items-center justify-between text-[11px] text-gray-600">
                      <span>Status: <span className="text-gray-400">{match.state || "pending"}</span></span>
                      {match.round && <span className="text-emerald-500/70 font-semibold">Round {match.round}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          )}
        </div>

      </div>
    </div>
  );
}