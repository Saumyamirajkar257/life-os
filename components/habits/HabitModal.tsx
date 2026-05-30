import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Target } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useHabitsStore, type Habit } from '@/store/useHabitsStore';
import { useToast } from '@/components/ui/Toast';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit: Habit | null;
}

const CATEGORIES = ['Health', 'Productivity', 'Learning', 'Mindfulness', 'Fitness', 'Other'];
const COLORS = [
  'bg-white text-black',
  'bg-rose-500 text-white',
  'bg-amber-500 text-white',
  'bg-emerald-500 text-white',
  'bg-blue-500 text-white',
  'bg-indigo-500 text-white',
  'bg-violet-500 text-white',
];

export function HabitModal({ isOpen, onClose, habitToEdit }: HabitModalProps) {
  const { addHabit, updateHabit } = useHabitsStore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState('Health');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      if (habitToEdit) {
        setTitle(habitToEdit.title);
        setDescription(habitToEdit.description || '');
        setFrequency(habitToEdit.frequency || 'daily');
        setCategory(habitToEdit.category || 'Health');
        setColor(habitToEdit.color || COLORS[0]);
      } else {
        setTitle('');
        setDescription('');
        setFrequency('daily');
        setCategory('Health');
        setColor(COLORS[0]);
      }
    }
  }, [isOpen, habitToEdit]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      toast('Title is required', 'warning');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      frequency,
      targetDays: frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5],
      category,
      color,
      icon: 'target'
    };

    if (habitToEdit) {
      updateHabit(habitToEdit.id, payload);
      toast('Habit updated successfully', 'success');
    } else {
      addHabit(payload);
      toast('Habit created successfully', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col"
      >
        <GlassCard className="flex flex-col h-full overflow-hidden" variant="strong">
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <h2 className="text-xl font-display font-semibold text-white">
              {habitToEdit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Read 10 Pages"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why are you doing this?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekdays</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Color Label</label>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-50 hover:opacity-100'} transition-all`}
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20 shrink-0">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              {habitToEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
