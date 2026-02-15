"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [masterData, setMasterData] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("AI siap menjawab berdasarkan data Anda...");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(true);

  // EFEEK AUTO-LOAD: Ambil data pas buka aplikasi
  useEffect(() => {
    const savedData = localStorage.getItem("myMasterData");
    if (savedData) setMasterData(savedData);
  }, []);

  // EFEK AUTO-SAVE: Simpan tiap kali masterData berubah
  useEffect(() => {
    localStorage.setItem("myMasterData", masterData);
  }, [masterData]);

  const generateAI = async () => {
    if (!input || !masterData) return alert("Isi Master Data dan Pertanyaan dulu!");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterData: masterData, pertanyaan: input }),
      });
      const data = await response.json();
      setOutput(data.jawaban || data.error);
    } catch (err) {
      setOutput("Error koneksi!");
    }
    setLoading(false);
  };

  const clearData = () => {
    if(confirm("Hapus semua Master Data?")) {
      setMasterData("");
      localStorage.removeItem("myMasterData");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-blue-500 tracking-tighter italic">ULTRA AI SAAS V1</h1>
          <div className="flex gap-2">
            <button onClick={clearData} className="text-xs bg-red-900/30 text-red-400 px-3 py-1 rounded-full hover:bg-red-900/50">Reset Data</button>
            <button onClick={() => setShowAdmin(!showAdmin)} className="text-xs bg-zinc-800 px-3 py-1 rounded-full hover:bg-zinc-700">
              {showAdmin ? "Sembunyikan Panel" : "Edit Master Data"}
            </button>
          </div>
        </div>

        {showAdmin && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl animate-in fade-in duration-500">
            <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-widest">Master Data (Auto-Saved)</h2>
            <textarea
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-sm text-blue-100 outline-none focus:border-blue-500 h-40 transition-all"
              placeholder="Paste data bisnis lu di sini (Contoh: Daftar Harga, List Tamu, Prosedur Perusahaan...)"
              value={masterData}
              onChange={(e) => setMasterData(e.target.value)}
            />
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-widest text-center">Tanya Data</h2>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-blue-500"
              placeholder="Tanya apapun tentang data di atas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateAI()}
            />
            <button onClick={generateAI} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-8 rounded-xl font-bold transition-all disabled:bg-zinc-800">
              {loading ? "..." : "KIRIM"}
            </button>
          </div>
          <div className="mt-6 p-6 bg-black rounded-xl border border-zinc-800 text-zinc-300 min-h-[150px] whitespace-pre-wrap leading-relaxed shadow-inner">
            {output}
          </div>
        </div>
        <p className="text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Secure AI Infrastructure • No Data Sharing</p>
      </div>
    </main>
  );
}