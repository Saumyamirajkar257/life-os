'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeGraph } from '@/components/brain/KnowledgeGraph';
import { useBrainStore, type NodeType, type KnowledgeNode } from '@/store/useBrainStore';
import { BrainNodeModal } from '@/components/brain/BrainNodeModal';
import { useToast } from '@/components/ui/Toast';
import { 
  Network, 
  List, 
  Search, 
  Plus, 
  Lightbulb, 
  BookOpen, 
  Link as LinkIcon, 
  FileText,
  Filter,
  Brain
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { pageTransition, fadeIn, staggerContainer, staggerItem } from '@/animations';
import { format } from 'date-fns';

export default function SecondBrainPage() {
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const { nodes, searchQuery, activeFilter, setSearchQuery, setActiveFilter, deleteNode } = useBrainStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<KnowledgeNode | null>(null);
  const { toast } = useToast();

  const filteredNodes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matchesFilter = (node: KnowledgeNode) => activeFilter === 'all' || node.type === activeFilter;
    
    if (!query) {
      return nodes.filter(matchesFilter);
    }

    const keywords = query.split(/\s+/).filter(Boolean);

    const scored = nodes
      .filter(matchesFilter)
      .map(node => {
        const titleLower = node.title.toLowerCase();
        const contentLower = node.content.toLowerCase();
        const tagsLower = node.tags.map(t => t.toLowerCase());

        // Exact substring matches
        const hasTitleMatch = titleLower.includes(query);
        const hasContentMatch = contentLower.includes(query);
        const hasTagMatch = tagsLower.some(t => t.includes(query));

        // Indiv. keyword matches
        const keywordTitleMatches = keywords.filter(kw => titleLower.includes(kw)).length;
        const keywordContentMatches = keywords.filter(kw => contentLower.includes(kw)).length;
        const keywordTagMatches = tagsLower.filter(t => keywords.some(kw => t.includes(kw))).length;

        // If no match at all, filter it out
        if (!hasTitleMatch && !hasContentMatch && !hasTagMatch && 
            keywordTitleMatches === 0 && keywordContentMatches === 0 && keywordTagMatches === 0) {
          return { node, score: 0 };
        }

        let score = 0;

        // 1. Title matches (highest weight)
        if (hasTitleMatch) score += 100;
        score += keywordTitleMatches * 20;
        if (titleLower.startsWith(query)) score += 30; // Prefix bonus

        // 2. Tag matches
        if (hasTagMatch) score += 60;
        score += keywordTagMatches * 15;

        // 3. Content matches
        if (hasContentMatch) score += 30;
        score += keywordContentMatches * 5;

        // 4. Proximity check (keywords appear close together in content)
        if (keywords.length > 1 && keywordContentMatches > 1) {
          const idx1 = contentLower.indexOf(keywords[0]);
          const idx2 = contentLower.indexOf(keywords[1]);
          if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) < 80) {
            score += 25; // Proximity bonus
          }
        }

        return { node, score };
      })
      .filter(item => item.score > 0);

    // Sort by relevance score descending
    return scored.sort((a, b) => b.score - a.score).map(item => item.node);
  }, [nodes, searchQuery, activeFilter]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const getTypeIcon = (type: NodeType) => {
    switch(type) {
      case 'note': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'idea': return <Lightbulb className="w-4 h-4 text-emerald-400" />;
      case 'resource': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'bookmark': return <LinkIcon className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 h-[calc(100vh-2rem)] flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-400" />
            Second Brain
          </h1>
          <p className="text-white/60 mt-1">Your connected knowledge graph and digital memory.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 w-64"
            />
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('graph')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'graph' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
              title="Graph View"
            >
              <Network className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => { setNodeToEdit(null); setIsModalOpen(true); }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {(['all', 'note', 'idea', 'resource', 'bookmark'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}s
          </button>
        ))}
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative">
        {/* Main Content Area */}
        <div className={`flex-1 rounded-2xl border border-white/10 overflow-hidden relative ${viewMode === 'graph' ? 'bg-black/40' : ''}`}>
          <AnimatePresence mode="wait">
            {viewMode === 'graph' ? (
              <motion.div
                key="graph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <KnowledgeGraph onNodeClick={(id) => setSelectedNodeId(id)} />
                <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-white/50 bg-black/40 p-3 rounded-xl backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Notes</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Ideas</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Resources</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-500"></div> Bookmarks</div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full overflow-y-auto p-4 pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar"
              >
                {filteredNodes.map(node => (
                  <motion.div key={node.id} variants={staggerItem} onClick={() => setSelectedNodeId(node.id)}>
                    <GlassCard 
                      className={`h-full cursor-pointer transition-all ${selectedNodeId === node.id ? 'ring-2 ring-indigo-500' : ''}`}
                      glowOnHover
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          {getTypeIcon(node.type)}
                          <span className="text-xs font-medium text-white/70 capitalize">{node.type}</span>
                        </div>
                        <span className="text-[10px] text-white/40">{format(new Date(node.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      <h3 className="text-base font-medium text-white mb-2 line-clamp-1">{node.title}</h3>
                      <p className="text-sm text-white/50 line-clamp-3 mb-4">{node.content}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {node.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                            #{tag}
                          </span>
                        ))}
                        {node.tags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                            +{node.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar for Selected Node Details */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="flex-shrink-0 h-full"
            >
              <GlassCard className="h-full flex flex-col p-5 overflow-y-auto custom-scrollbar" variant="strong">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedNode.type)}
                    <span className="text-sm font-medium text-white/70 capitalize">{selectedNode.type}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="text-white/40 hover:text-white transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>

                <h2 className="text-xl font-display font-semibold text-white mb-2">
                  {selectedNode.title}
                </h2>
                
                <div className="text-xs text-white/40 mb-6 flex flex-col gap-1">
                  <span>Created: {format(new Date(selectedNode.createdAt), 'PPpp')}</span>
                  <span>Updated: {format(new Date(selectedNode.updatedAt), 'PPpp')}</span>
                </div>

                <div className="prose prose-invert prose-sm text-white/70 mb-8 flex-1">
                  <p>{selectedNode.content}</p>
                  {selectedNode.url && (
                    <a href={selectedNode.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-4 not-prose">
                      <LinkIcon className="w-3 h-3" />
                      {selectedNode.url}
                    </a>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Network className="w-3 h-3" />
                    Connected Nodes ({selectedNode.connections.length})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedNode.connections.length > 0 ? (
                      selectedNode.connections.map(connId => {
                        const connNode = nodes.find(n => n.id === connId);
                        if (!connNode) return null;
                        return (
                          <div 
                            key={connId} 
                            onClick={() => setSelectedNodeId(connId)}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition-colors"
                          >
                            {getTypeIcon(connNode.type)}
                            <span className="text-xs text-white truncate">{connNode.title}</span>
                          </div>
                        )
                      })
                    ) : (
                      <span className="text-xs text-white/30 italic">No direct connections</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/10 flex gap-2">
                  <button 
                    onClick={() => { setNodeToEdit(selectedNode); setIsModalOpen(true); }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => { deleteNode(selectedNode.id); setSelectedNodeId(null); toast('Node deleted', 'info'); }}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <BrainNodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        nodeToEdit={nodeToEdit} 
      />
    </motion.div>
  );
}
