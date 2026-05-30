'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { useTasksStore } from '@/store/useTasksStore';
import { TaskFilters, TaskItem, AddTaskModal } from '@/features/tasks';
import { type Task, type TaskView, type TaskStatusFilter } from '@/features/tasks/types';

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<TaskView>('all');
  const [activeStatus, setActiveStatus] = useState<TaskStatusFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasksStore();

  // Dynamic filter logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        const matchesProject = task.project?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }

      // 2. Tag filter (highest precedence if active)
      if (selectedTag) {
        return task.tags.includes(selectedTag);
      }

      // 3. View filter
      const todayStr = new Date().toISOString().split('T')[0];
      if (activeView === 'today') {
        if (task.dueDate !== todayStr) return false;
      } else if (activeView === 'upcoming') {
        if (!task.dueDate || task.dueDate <= todayStr) return false;
      }

      // 4. Status filter
      if (activeStatus === 'completed') {
        if (!task.completed) return false;
      } else if (activeStatus === 'not-started') {
        if (task.completed) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, activeView, activeStatus, selectedTag]);

  // Task list counts
  const counts = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const views = { all: 0, today: 0, upcoming: 0 };
    const status = { all: 0, notStarted: 0, completed: 0 };
    const tags: Record<string, number> = { Work: 0, Personal: 0, Health: 0, Urgent: 0 };

    tasks.forEach((task) => {
      // Views count
      views.all++;
      if (task.dueDate === todayStr) views.today++;
      if (task.dueDate && task.dueDate > todayStr) views.upcoming++;

      // Status count
      status.all++;
      if (task.completed) status.completed++;
      else status.notStarted++;

      // Tags count
      task.tags.forEach((tag) => {
        if (tags[tag] !== undefined) {
          tags[tag]++;
        }
      });
    });

    return { views, status, tags };
  }, [tasks]);

  // Group tasks for render
  const highPriorityTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.priority === 'high' && !t.completed);
  }, [filteredTasks]);

  const otherTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.priority !== 'high' && !t.completed);
  }, [filteredTasks]);

  const completedTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.completed);
  }, [filteredTasks]);

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Loading task systems...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Tasks</h1>
          <p className="text-white/40 text-sm mt-1">Manage your tasks, projects, and deadlines</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
          {/* Add Task Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-black font-medium text-sm rounded-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Filters */}
        <TaskFilters
          activeView={activeView}
          setActiveView={setActiveView}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          counts={counts}
        />

        {/* Right Tasks Main Area */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6 w-full"
          >
            {/* 1. High Priority Tasks */}
            {highPriorityTasks.length > 0 && (
              <motion.div variants={staggerItem} className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
                    High Priority
                  </h3>
                  <span className="text-xs font-mono text-white/30">
                    {highPriorityTasks.length} {highPriorityTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {highPriorityTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 2. Other Tasks */}
            {otherTasks.length > 0 && (
              <motion.div variants={staggerItem} className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
                    Active Tasks
                  </h3>
                  <span className="text-xs font-mono text-white/30">
                    {otherTasks.length} {otherTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {otherTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 3. Completed Tasks */}
            {completedTasks.length > 0 && (
              <motion.div variants={staggerItem} className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display font-medium text-white/40 text-sm tracking-wide">
                    Completed
                  </h3>
                  <span className="text-xs font-mono text-white/30">
                    {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {completedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <motion.div
                variants={staggerItem}
                className="glass-panel border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white/20" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white/80">No tasks found</h3>
                  <p className="text-sm text-white/30 mt-1 max-w-sm">
                    No active tasks match your filters or search terms. Get started by adding a task.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl text-xs font-medium transition-all"
                >
                  Create Your First Task
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Task Creation/Editing Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={addTask}
        onUpdate={updateTask}
        editingTask={editingTask}
      />
    </motion.div>
  );
}
