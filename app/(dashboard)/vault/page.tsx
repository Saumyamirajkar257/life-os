'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useVaultStore } from '@/store/useVaultStore';
import { Link as LinkIcon, Plus, BookOpen, Video, FileText, Globe, GraduationCap, Search, Trash2, Cpu, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function VaultPage() {
  const [mounted, setMounted] = useState(false);
  const { resources, addResource, deleteResource } = useVaultStore();
  const { toast } = useToast();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsProcessing(true);
    // Auto category simulates 1.2s latency in store
    await addResource(title.trim(), url.trim(), '');
    toast('Resource saved and categorized via AI', 'success');
    setUrl('');
    setTitle('');
    setIsProcessing(false);
  };

  const getIconForCategory = (cat: string) => {
    switch (cat) {
      case 'YouTube Video': return <Video className="w-5 h-5 text-rose-400" />;
      case 'PDF Document': return <FileText className="w-5 h-5 text-red-400" />;
      case 'Article': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'Course': return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      default: return <Globe className="w-5 h-5 text-blue-400" />;
    }
  };

  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  const filteredResources = useMemo(() => {
    if (filter === 'All') return resources;
    return resources.filter(r => r.category === filter);
  }, [resources, filter]);

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white/30 font-display text-lg">
          Loading Vault...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Cpu className="w-8 h-8 text-indigo-400" />
          Resource Vault
        </h1>
        <p className="text-white/40 text-sm mt-1">Store websites, videos, PDFs, and courses. AI auto-categorizes everything.</p>
      </div>

      {/* Input Section */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-white/50" />
          Store New Resource
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
          <div className="flex-1 flex flex-col gap-3">
            <input
              type="url"
              required
              placeholder="Paste URL here (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
            <input
              type="text"
              placeholder="Custom Title (optional, AI will infer if empty)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0 h-[46px]"
          >
            {isProcessing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Cpu className="w-4 h-4" />
              </motion.div>
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'AI Processing...' : 'Save & Categorize'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
              filter === cat 
                ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource) => (
            <motion.div
              layout
              variants={fadeInUp}
              exit={{ opacity: 0, scale: 0.95 }}
              key={resource.id}
            >
              <GlassCard className="flex flex-col h-full hover:border-white/20 transition-all duration-300 group overflow-hidden">
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {getIconForCategory(resource.category)}
                    </div>
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="text-white/20 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-display font-semibold text-white text-lg leading-tight line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-white/40 text-xs font-mono mt-1 uppercase tracking-wider">
                      {resource.category} • {resource.difficulty}
                    </p>
                  </div>

                  <p className="text-white/50 text-sm line-clamp-2 mt-2">
                    {resource.notes}
                  </p>
                </div>
                
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-mono text-white/40">
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-mono text-white/40">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredResources.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/30 font-mono text-sm border border-dashed border-white/10 rounded-2xl">
            No resources found. Store some knowledge!
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
