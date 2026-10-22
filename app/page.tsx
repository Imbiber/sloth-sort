'use client';

import React, { useState, useRef } from 'react';
import { 
  FolderSync, 
  Sparkles, 
  Volume2, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Flame, 
  UploadCloud, 
  Copy, 
  Download,
  Coffee,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { FileItem, SortPlan } from '@/types';
import confetti from 'canvas-confetti';

const SAMPLE_MESSY_FILES: FileItem[] = [
  { id: '1', name: 'IMG_20261019_142311.jpg', size: 3420100, previewSnippet: 'High-res photo of product packaging design draft for coffee mug' },
  { id: '2', name: 'Receipt_Uber_Eats_Oct14.pdf', size: 104500, previewSnippet: 'Total $24.50, Payment Method: Apple Card, Date: 2026-10-14' },
  { id: '3', name: 'Screen Shot 2026-10-21 at 11.45.12 PM.png', size: 890200, previewSnippet: 'Figma wireframe of checkout modal design with comments' },
  { id: '4', name: 'final_pitch_deck_v3_revised_FINAL2.pptx', size: 14500200, previewSnippet: 'Q4 2026 Investor Pitch Deck, market analysis and traction statistics' },
  { id: '5', name: 'contract_nda_mutual_signable_oct.pdf', size: 420000, previewSnippet: 'Non-Disclosure Agreement between Acme Corp and Contractor' },
  { id: '6', name: 'db_dump_backup_2026_10_20.sql.gz', size: 45000000, previewSnippet: 'Database dump PostgreSQL users, products, orders tables' },
  { id: '7', name: 'wifi_passwords_and_notes.txt', size: 1200, previewSnippet: 'Guest wifi: SlothVilla2026, admin credentials notes' }
];

export default function Home() {
  const [fileList, setFileList] = useState<FileItem[]>(SAMPLE_MESSY_FILES);
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortPlan, setSortPlan] = useState<SortPlan | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems: FileItem[] = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));
    setFileList((prev) => [...prev, ...newItems]);
  };

  const handleAddCustomTextFiles = () => {
    if (!customInput.trim()) return;
    const lines = customInput.split('\n').filter(l => l.trim().length > 0);
    const newItems: FileItem[] = lines.map((line, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: line.trim(),
      size: 1024,
    }));
    setFileList((prev) => [...prev, ...newItems]);
    setCustomInput('');
  };

  const handleOrganize = async () => {
    if (fileList.length === 0) return;
    setLoading(true);
    setSortPlan(null);
    setAudioUrl(null);

    try {
      const res = await fetch('/api/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: fileList }),
      });

      const data = await res.json();
      if (data.plan) {
        setSortPlan(data.plan);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.error || 'Failed to sort files');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with Gemma 2');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async (text: string) => {
    setAudioLoading(true);
    try {
      const res = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('Audio generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (e: any) {
      alert('Could not generate voice debrief: ' + e.message);
    } finally {
      setAudioLoading(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const copyBashScript = () => {
    if (!sortPlan) return;
    navigator.clipboard.writeText(sortPlan.bashOrganizeScript);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Banner */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            🦥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl tracking-tight text-white">SlothSort</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                HF26 Week 3
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-Effort File & Clutter Organizer powered by Google Gemma 2 & ElevenLabs</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% On-Device Gemma 2</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Volume2 className="w-4 h-4 text-teal-400" />
            <span>ElevenLabs Voice AI</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Clutter Input */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-semibold text-white">Lazy Clutter Queue</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                {fileList.length} items
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Drag in downloads, unorganized screenshots, messy invoice folders, or paste filenames. The local Gemma model does the tedious thinking.
            </p>

            {/* Drop / Select zone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 hover:bg-slate-900/50 transition-all rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition" />
              <span className="text-sm font-medium text-slate-300">Drop files here or click to browse</span>
              <span className="text-xs text-slate-500">Zero upload to cloud — processed strictly locally</span>
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>

            {/* Quick paste textarea */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-400">Or paste filenames (one per line):</span>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="invoice_oct_final_v2.pdf&#10;IMG_8829.PNG"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
                <button
                  onClick={handleAddCustomTextFiles}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Current Item list preview */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {fileList.map((file, i) => (
                <div key={file.id || i} className="flex items-center justify-between text-xs bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 hover:border-slate-700 transition">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate font-mono text-slate-300">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => setFileList(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-red-400 text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="pt-2 flex gap-3">
              <button
                disabled={loading || fileList.length === 0}
                onClick={handleOrganize}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Gemma 2 Thinking (Lazy Mode)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Let Sloth AI Organize Everything</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setFileList(SAMPLE_MESSY_FILES)}
                className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                title="Reset to Sample Files"
              >
                Reset Demo
              </button>
            </div>
          </div>

          {/* Sloth Philosophy Widget */}
          <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/30 rounded-2xl p-5 text-xs text-slate-300 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>🦥 Sloth Manifesto for Week 3:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Why spend your Sunday evening manually clicking, dragging, and renaming 80 random files across your desktop? SlothSort delegates cognitive load to local Gemma 2. $0 cloud tokens, zero files sent to external servers, and maximum laziness achieved.
            </p>
          </div>
        </section>

        {/* Right Column: Results & Actionable Script */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {!sortPlan ? (
            <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[450px]">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-3xl">
                😴
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-200">Waiting for you to relax</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Hit the "Let Sloth AI Organize Everything" button. Gemma 2 will classify the clutter, generate clean semantic names, and give you a 1-click execution script.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Lazy Stats & Audio debrief Header */}
              <div className="bg-gradient-to-r from-emerald-900/30 via-slate-900 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">Files Sorted with Zero Human Effort</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Saved an estimated <span className="font-bold text-emerald-400">{sortPlan.estimatedLazyMinutesSaved} minutes</span> of manual drag-and-drop drudgery.
                  </p>
                </div>

                {/* ElevenLabs Audio Player */}
                <div className="flex items-center gap-2">
                  <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
                  {audioUrl ? (
                    <button
                      onClick={toggleAudio}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'Pause Sloth Debrief' : 'Replay Voice Debrief'}</span>
                    </button>
                  ) : (
                    <button
                      disabled={audioLoading}
                      onClick={() => handleGenerateAudio(sortPlan.slothAudioScript)}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition disabled:opacity-50"
                    >
                      {audioLoading ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          <span>Voicing via ElevenLabs...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Hear Sloth Debrief (Audio)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Spoken Quote Banner */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">🎙️</span>
                <div className="text-xs italic text-slate-300 leading-relaxed">
                  "{sortPlan.slothAudioScript}"
                </div>
              </div>

              {/* Categorized Folders */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <FolderSync className="w-4 h-4 text-emerald-400" />
                  Proposed Organization Structure
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {sortPlan.categories.map((cat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div>
                          <span className="font-semibold text-xs text-white">{cat.name}</span>
                          <p className="text-[11px] text-slate-400">{cat.description}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {cat.files?.length || 0} items
                        </span>
                      </div>

                      <div className="space-y-2">
                        {cat.files?.map((f, fIdx) => (
                          <div key={fIdx} className="bg-slate-950/80 rounded-lg p-2.5 text-xs flex flex-col gap-1 border border-slate-800/60">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-red-400 line-through truncate max-w-[220px]" title={f.originalName}>
                                {f.originalName}
                              </span>
                              <span className="text-slate-600 font-mono">➔</span>
                              <span className="font-mono text-emerald-400 font-semibold truncate max-w-[240px]" title={f.suggestedName}>
                                {f.suggestedName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                              <span>{f.summary}</span>
                              <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                                {f.action}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Terminal Automation Script */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">1-Click Terminal Execution Script</span>
                  </div>
                  <button
                    onClick={copyBashScript}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1.5 transition"
                  >
                    {copiedBash ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBash ? 'Copied' : 'Copy Bash Script'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-36 leading-relaxed border border-slate-800/80">
                  {sortPlan.bashOrganizeScript}
                </pre>
                <p className="text-[11px] text-slate-500">
                  Save this as <code className="text-slate-400 font-mono">organize.sh</code> in your folder and run <code className="text-slate-400 font-mono">bash organize.sh</code> to perform the moves instantly.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
