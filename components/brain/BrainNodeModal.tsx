import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Network, Link as LinkIcon, FileText, Lightbulb, BookOpen, Plus, Tag } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useBrainStore, type KnowledgeNode, type NodeType } from '@/store/useBrainStore';
import { useToast } from '@/components/ui/Toast';

interface BrainNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeToEdit: KnowledgeNode | null;
}

export function BrainNodeModal({ isOpen, onClose, nodeToEdit }: BrainNodeModalProps) {
  const { nodes, addNode, updateNode } = useBrainStore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<NodeType>('note');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [connections, setConnections] = useState<string[]>([]);
  const [searchConn, setSearchConn] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (nodeToEdit) {
        setTitle(nodeToEdit.title);
        setContent(nodeToEdit.content);
        setType(nodeToEdit.type);
        setUrl(nodeToEdit.url || '');
        setTags(nodeToEdit.tags || []);
        setConnections(nodeToEdit.connections || []);
      } else {
        setTitle('');
        setContent('');
        setType('note');
        setUrl('');
        setTags([]);
        setTagInput('');
        setConnections([]);
      }
    }
  }, [isOpen, nodeToEdit]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast('Title and content are required', 'warning');
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      type,
      url: url.trim() || undefined,
      tags,
      connections
    };

    if (nodeToEdit) {
      updateNode(nodeToEdit.id, payload);
      toast('Node updated successfully', 'success');
    } else {
      addNode(payload);
      toast('Node created successfully', 'success');
    }
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const toggleConnection = (id: string) => {
    if (connections.includes(id)) {
      setConnections(connections.filter(c => c !== id));
    } else {
      setConnections([...connections, id]);
    }
  };

  const filteredConnections = nodes.filter(n => 
    n.id !== nodeToEdit?.id && 
    (n.title.toLowerCase().includes(searchConn.toLowerCase()) || n.type.includes(searchConn.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <GlassCard className="flex flex-col h-full overflow-hidden" variant="strong">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <h2 className="text-xl font-display font-semibold text-white">
              {nodeToEdit ? 'Edit Node' : 'New Node'}
            </h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            
            {/* Type Selector */}
            <div className="grid grid-cols-4 gap-2">
              {(['note', 'idea', 'resource', 'bookmark'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    type === t 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {t === 'note' && <FileText className="w-5 h-5" />}
                  {t === 'idea' && <Lightbulb className="w-5 h-5" />}
                  {t === 'resource' && <BookOpen className="w-5 h-5" />}
                  {t === 'bookmark' && <LinkIcon className="w-5 h-5" />}
                  <span className="text-xs font-medium capitalize">{t}</span>
                </button>
              ))}
            </div>

            {/* Title & Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Elaborate your thoughts here..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 custom-scrollbar resize-none"
                />
              </div>
              {type === 'bookmark' && (
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">URL (Optional)</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter or comma to add tags..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Connections */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1 flex items-center gap-1">
                <Network className="w-3 h-3" /> Connect to other nodes
              </label>
              <input
                type="text"
                value={searchConn}
                onChange={(e) => setSearchConn(e.target.value)}
                placeholder="Search nodes..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-2"
              />
              <div className="max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1 border border-white/10 rounded-xl p-1 bg-black/20">
                {filteredConnections.length > 0 ? filteredConnections.map(n => (
                  <div
                    key={n.id}
                    onClick={() => toggleConnection(n.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      connections.includes(n.id) ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-sm text-white/80 truncate pr-4">{n.title}</span>
                    {connections.includes(n.id) && <span className="text-xs text-indigo-400 shrink-0">Connected</span>}
                  </div>
                )) : (
                  <div className="p-4 text-center text-xs text-white/30">No nodes found</div>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20 shrink-0">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Save Node
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
