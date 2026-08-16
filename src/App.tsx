import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Skull,
  Search,
  User,
  Gavel,
  AlertTriangle,
  Users,
  Copy,
  Play,
  LogIn,
  ArrowRight,
} from "lucide-react";

// Karakter realistis menggunakan gambar placeholder (Unsplash) untuk kesan profesional
const CHARACTERS = [
  {
    id: "c1",
    name: "Yoon Seo",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c2",
    name: "Jun Hee",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c3",
    name: "Jung Won",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c4",
    name: "Kyung Jun",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c5",
    name: "Da Bum",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c6",
    name: "So Mi",
    image:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c7",
    name: "Eun Chan",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: "c8",
    name: "Ji Soo",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
  },
];

const ROLES = [
  {
    id: "MAFIA",
    name: "Mafia",
    desc: "Bunuh warga di malam hari.",
    team: "MAFIA",
    color: "text-red-500",
  },
  {
    id: "DOKTER",
    name: "Dokter",
    desc: "Selamatkan warga di malam hari.",
    team: "WARGA",
    color: "text-green-400",
  },
  {
    id: "POLISI",
    name: "Polisi",
    desc: "Selidiki identitas pemain.",
    team: "WARGA",
    color: "text-blue-400",
  },
  {
    id: "WARGA",
    name: "Warga",
    desc: "Temukan mafia saat siang.",
    team: "WARGA",
    color: "text-gray-300",
  },
];

export default function App() {
  const [appState, setAppState] = useState("MENU"); // MENU, LOBBY, GAME
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  // Game State
  const [players, setPlayers] = useState<any[]>([]);
  const [myPlayerId, setMyPlayerId] = useState<number | null>(null);
  const [phase, setPhase] = useState("NIGHT"); // NIGHT, DAY, VOTE
  const [day, setDay] = useState(1);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState(null);

  // --- MENU ACTIONS ---
  const handleCreateRoom = () => {
    if (!playerName) return alert("Masukkan nama Anda!");
    const newRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setRoomCode(newRoomCode);

    // Simulasi membuat room sebagai host
    const myPlayer = {
      id: 1,
      name: playerName,
      character: CHARACTERS[0],
      isHost: true,
      isAlive: true,
      role: null,
    };
    setPlayers([myPlayer]);
    setMyPlayerId(1);
    setAppState("LOBBY");
  };

  const handleJoinRoom = () => {
    if (!playerName || !roomCode) return alert("Masukkan Nama dan Kode Room!");

    // Simulasi join room
    const myPlayer = {
      id: 2,
      name: playerName,
      character: CHARACTERS[1],
      isHost: false,
      isAlive: true,
      role: null,
    };
    setPlayers([
      {
        id: 1,
        name: "HostPlayer",
        character: CHARACTERS[0],
        isHost: true,
        isAlive: true,
        role: null,
      },
      myPlayer,
      ...CHARACTERS.slice(2, 8).map((c, i) => ({
        id: i + 3,
        name: `Player ${i + 3}`,
        character: c,
        isHost: false,
        isAlive: true,
        role: null,
      })),
    ]);
    setMyPlayerId(2);
    setAppState("LOBBY");
  };

  const handleSimulateFullLobby = () => {
    // Fungsi khusus preview untuk memenuhi kuota 8 pemain
    const fullPlayers = CHARACTERS.map((c, i) => ({
      id: i + 1,
      name: i === 0 ? playerName || "Kamu" : `Pemain ${i + 1}`,
      character: c,
      isHost: i === 0,
      isAlive: true,
      role: null,
    }));
    setPlayers(fullPlayers);
  };

  const startGame = () => {
  if (players.length < 4) return alert("Minimal 4 pemain untuk memulai!");

  // Siapkan 8 peran dasar
  const availableRoles = [ROLES[0], ROLES[0], ROLES[1], ROLES[2], ROLES[3], ROLES[3], ROLES[3], ROLES[3]];

  // Acak susunan perannya secara random (Shuffle)
  const shuffledRoles = availableRoles.sort(() => Math.random() - 0.5);

  const updatedPlayers = players.map((p, index) => ({
      ...p,
      role: shuffledRoles[index % shuffledRoles.length] 
  }));


    setPlayers(updatedPlayers);
    setLogs([
      {
        type: "system",
        text: "Aplikasi pembunuh diaktifkan. Permainan dimulai.",
      },
    ]);
    setPhase("NIGHT");
    setDay(1);
    setAppState("GAME");
  };

  const myPlayer = players.find((p) => p.id === myPlayerId);
  const konfirmasiMalam = () => {
    setLogs([...logs, { type: 'system', text: 'Malam telah berlalu. Target Anda telah dieksekusi.' }]);
    setPhase('DAY');
    setSelectedTarget(null);
  };

  const konfirmasiVoting = () => {
    setLogs([...logs, { type: 'system', text: 'Pemungutan suara selesai. Warga telah membuat keputusan.' }]);
    setPhase('NIGHT');
    setDay(day + 1);
    setSelectedTarget(null);
  };
    
  // --- UI COMPONENTS ---
  if (appState === "MENU") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
        <div className="max-w-md w-full backdrop-blur-xl bg-black/40 p-8 rounded-2xl border border-white/10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto animate-pulse" />
            <h1 className="text-4xl font-black tracking-widest text-red-600">
              NIGHT HAS COME
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              Multiplayer Edition
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Masukkan Nama Anda"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCreateRoom}
                className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Users className="w-5 h-5" /> Buat Room
              </button>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kode"
                  className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-center font-mono focus:outline-none focus:border-blue-500 uppercase"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />
                <button
                  onClick={handleJoinRoom}
                  className="w-1/2 bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <LogIn className="w-4 h-4" /> Gabung
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appState === "LOBBY") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-6 bg-[url('https://images.unsplash.com/photo-1505672678657-cc7037095e60?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center bg-blend-overlay bg-black/80">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex justify-between items-center backdrop-blur-md bg-black/50 p-6 rounded-2xl border border-white/10">
            <div>
              <h1 className="text-3xl font-black text-red-600 tracking-wider">
                LOBBY PERMAINAN
              </h1>
              <p className="text-gray-400 mt-1">Menunggu pemain bergabung...</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Kode Room</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-mono font-bold tracking-widest">
                  {roomCode || "SIMULATION"}
                </span>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {players.map((p) => (
              <div
                key={p.id}
                className="relative group overflow-hidden rounded-xl aspect-[3/4] border-2 border-white/10"
              >
                <img
                  src={p.character.image}
                  alt={p.character.name}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-xs text-red-400 font-bold uppercase">
                    {p.character.name}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {p.name} {p.id === myPlayerId && "(Kamu)"}
                  </span>
                  {p.isHost && (
                    <span className="absolute top-3 right-3 bg-red-600 text-xs px-2 py-1 rounded-full font-bold">
                      HOST
                    </span>
                  )}
                </div>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: 8 - players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="rounded-xl aspect-[3/4] border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 bg-white/5 backdrop-blur-sm"
              >
                <User className="w-12 h-12 mb-2 opacity-50" />
                <span>Menunggu...</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-black/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-gray-300">
              {players.length} / 8 Pemain Bergabung
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSimulateFullLobby}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Isi Penuh (Simulasi)
              </button>
              {myPlayer?.isHost && (
                <button
                  onClick={startGame}
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                  <Play className="w-5 h-5" /> Mulai Game
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GAME VIEW ---
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
      {/* Cinematic Top Bar */}
      <header className="h-20 bg-black border-b border-white/10 flex items-center justify-between px-8 shrink-0 relative z-10 shadow-2xl">
        <h1 className="text-2xl font-black text-red-600 tracking-widest flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" /> NIGHT HAS COME
        </h1>
        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-3 px-6 py-2 rounded-full font-bold uppercase tracking-wider border ${
              phase === "NIGHT"
                ? "bg-indigo-950/50 border-indigo-500/50 text-indigo-300"
                : phase === "DAY"
                ? "bg-yellow-950/50 border-yellow-500/50 text-yellow-300"
                : "bg-red-950/50 border-red-500/50 text-red-300"
            }`}
          >
            {phase === "NIGHT" ? (
              <Moon className="w-5 h-5" />
            ) : phase === "DAY" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Gavel className="w-5 h-5" />
            )}
            {phase === "NIGHT"
              ? `Malam ${day}`
              : phase === "DAY"
              ? `Siang ${day}`
              : `Voting ${day}`}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Players Grid */}
        <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {players.map((p) => (
              <div
                key={p.id}
                onClick={() =>
                  p.isAlive && p.id !== myPlayerId && setSelectedTarget(p.id)
                }
                className={`relative group overflow-hidden rounded-xl aspect-[3/4] transition-all duration-300 cursor-pointer border-2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ${
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  !p.isAlive
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ? "border-red-900/50 opacity-40 grayscale"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    : "border-white/10 hover:border-white/40"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ${
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              selectedTarget ===
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              p.id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ? "border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] scale-105 z-10"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : ""
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    `}
              >
                <img
                  src={p.character.image}
                  alt={p.character.name}
                  className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-sm text-gray-300 font-bold uppercase tracking-wider">
                    {p.character.name}
                  </span>
                  <span
                    className={`text-xl font-bold ${
                      p.id === myPlayerId ? "text-blue-400" : "text-white"
                    }`}
                  >
                    {p.name} {p.id === myPlayerId && "(Kamu)"}
                  </span>

                  {!p.isAlive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 backdrop-blur-sm">
                      <Skull className="w-16 h-16 text-red-500" />
                    </div>
                  )}
                </div>

                {selectedTarget === p.id && p.isAlive && (
                  <div className="absolute top-4 right-4 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center animate-bounce">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard & Logs */}
        <div className="w-[400px] bg-black border-l border-white/10 flex flex-col shrink-0">
          {/* My Role Card */}
          <div className="p-6 border-b border-white/10 bg-slate-900/50 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Search className="w-32 h-32" />
            </div>
            <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">
              Identitas Rahasia
            </h3>
            <h2 className={`text-3xl font-black mb-2 ${myPlayer?.role?.color}`}>
              {myPlayer?.role?.name || "Loading..."}
            </h2>
            <p className="text-gray-300 text-sm">{myPlayer?.role?.desc}</p>
          </div>

          {/* Action Panel */}
          <div className="p-6 border-b border-white/10 bg-black/60">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Aksi Anda
            </h3>
            {phase === "NIGHT" && myPlayer?.role?.team !== "WARGA" ? (
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  Pilih target di papan, lalu konfirmasi aksi Anda.
                </p>
                <button
                  onClick={konfirmasiMalam}
                  disabled={!selectedTarget}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    selectedTarget
                      ? "bg-red-700 hover:bg-red-600 text-white"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Konfirmasi Target Malam
                </button>
              </div>
            ) : phase === "VOTE" ? (
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  Pilih satu pemain untuk dieksekusi.
                </p>
                <button
                  onClick={konfirmasiVoting}
                  disabled={!selectedTarget}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    selectedTarget
                      ? "bg-red-700 hover:bg-red-600 text-white"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Voting Eksekusi
                </button>
              </div>
              } : phase === 'DAY' ? (
      <div>
          <p className="text-sm text-gray-400 mb-4">Waktu diskusi. Tentukan siapa yang mencurigakan, lalu mulai pemungutan suara.</p>
          <button 
              onClick={() => setPhase('VOTE')}
              className="w-full py-3 rounded-lg font-bold transition-all bg-yellow-700 hover:bg-yellow-600 text-white"
          >
              Lanjut ke Sesi Voting
          </button>
      </div>
  ) : null}

          </div>

          {/* Chat & Logs (Simulasi Real-time) */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">
              Log Sistem & Obrolan
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-gray-600 text-sm">Belum ada aktivitas...</p>
              ) : (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm border-l-2 ${
                      log.type === "system"
                        ? "bg-red-950/30 border-red-600 text-red-200"
                        : "bg-white/5 border-blue-500 text-gray-200"
                    }`}
                  >
                    {log.text}
                  </div>
                ))
              )}
            </div>
            {/* Chat Input */}
            <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Kirim pesan ke warga..."
                className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 p-2 rounded-lg">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
