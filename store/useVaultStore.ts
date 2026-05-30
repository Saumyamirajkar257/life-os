import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';
import { auth } from '@/lib/firebase';

export interface VaultResource {
  id: string;
  title: string;
  url: string;
  category: 'Website' | 'YouTube Video' | 'PDF Document' | 'Article' | 'Course';
  tags: string[];
  notes: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dateAdded: string;
}

interface VaultState {
  resources: VaultResource[];
  addResource: (title: string, url: string, notes: string) => Promise<void>;
  deleteResource: (id: string) => void;
  updateResource: (id: string, updates: Partial<VaultResource>) => void;
}

const initialResources: VaultResource[] = [
  {
    id: 'vault-1',
    title: 'Intro to Quantum Computing: Core Mechanics',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'YouTube Video',
    tags: ['#stem', '#science', '#quantum'],
    notes: 'An excellent video tutorial explaining qubits, superposition, and quantum gates.',
    difficulty: 'Beginner',
    dateAdded: '2026-05-28T10:00:00.000Z'
  },
  {
    id: 'vault-2',
    title: 'Deep Learning Book (Chapter 6: Deep Feedforward Networks)',
    url: 'https://www.deeplearningbook.org/contents/mlp.pdf',
    category: 'PDF Document',
    tags: ['#ai', '#tech', '#stem'],
    notes: 'Core textbook chapter detailing multilayer perceptrons, backpropagation, and cost functions.',
    difficulty: 'Advanced',
    dateAdded: '2026-05-28T14:30:00.000Z'
  },
  {
    id: 'vault-3',
    title: 'Synaptic Plasticity and the Biology of Memory Decay',
    url: 'https://medium.com/science-of-mind/synaptic-plasticity-memory-decay-7389182a',
    category: 'Article',
    tags: ['#biology', '#science', '#education'],
    notes: 'An interesting read mapping cellular LTP/LTD processes to local memory curves.',
    difficulty: 'Intermediate',
    dateAdded: '2026-05-29T09:15:00.000Z'
  },
  {
    id: 'vault-4',
    title: 'Next.js 15 Masterclass: Production Level Architectures',
    url: 'https://www.udemy.com/course/nextjs-masterclass-2026',
    category: 'Course',
    tags: ['#development', '#webdev', '#tech'],
    notes: 'Comprehensive course covering Server Actions, App Router caching, and edge middleware optimization.',
    difficulty: 'Advanced',
    dateAdded: '2026-05-29T11:45:00.000Z'
  }
];

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      resources: initialResources,
      addResource: async (title, url, notes) => {
        // AI Auto-Categorization Logic
        const lowerTitle = title.toLowerCase();
        const lowerUrl = url.toLowerCase();
        
        // 1. Detect Category
        let category: VaultResource['category'] = 'Website';
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('watch?v=')) {
          category = 'YouTube Video';
        } else if (lowerUrl.includes('.pdf') || lowerTitle.includes('pdf')) {
          category = 'PDF Document';
        } else if (lowerUrl.includes('udemy.com') || lowerUrl.includes('coursera.org') || lowerUrl.includes('edx.org') || lowerUrl.includes('pluralsight.com') || lowerTitle.includes('course') || lowerTitle.includes('class') || lowerTitle.includes('tutorial')) {
          category = 'Course';
        } else if (lowerUrl.includes('medium.com') || lowerUrl.includes('substack.com') || lowerUrl.includes('wikipedia.org') || lowerUrl.includes('dev.to') || lowerUrl.includes('arxiv.org') || lowerTitle.includes('article') || lowerTitle.includes('paper') || lowerTitle.includes('read') || lowerTitle.includes('review')) {
          category = 'Article';
        }

        // 2. Generate Smart Tags
        const tagsSet = new Set<string>();
        if (lowerTitle.includes('react') || lowerTitle.includes('next') || lowerTitle.includes('js') || lowerTitle.includes('ts') || lowerTitle.includes('web') || lowerTitle.includes('dev') || lowerTitle.includes('code') || lowerTitle.includes('programming') || lowerTitle.includes('development')) {
          tagsSet.add('#development');
          tagsSet.add('#tech');
        }
        if (lowerTitle.includes('quantum') || lowerTitle.includes('phys') || lowerTitle.includes('math') || lowerTitle.includes('alg') || lowerTitle.includes('calculus') || lowerTitle.includes('geometry') || lowerTitle.includes('equation') || lowerUrl.includes('arxiv')) {
          tagsSet.add('#stem');
          tagsSet.add('#science');
        }
        if (lowerTitle.includes('bio') || lowerTitle.includes('chem') || lowerTitle.includes('cell') || lowerTitle.includes('gene') || lowerTitle.includes('brain') || lowerTitle.includes('synapse')) {
          tagsSet.add('#biology');
          tagsSet.add('#science');
        }
        if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('deep') || lowerTitle.includes('learn') || lowerTitle.includes('neural') || lowerTitle.includes('gpt') || lowerTitle.includes('transformer') || lowerTitle.includes('intelligence')) {
          tagsSet.add('#ai');
          tagsSet.add('#tech');
        }
        if (lowerTitle.includes('finance') || lowerTitle.includes('money') || lowerTitle.includes('stock') || lowerTitle.includes('budget') || lowerTitle.includes('invest') || lowerTitle.includes('saving')) {
          tagsSet.add('#finance');
          tagsSet.add('#money');
        }
        if (lowerTitle.includes('study') || lowerTitle.includes('focus') || lowerTitle.includes('habit') || lowerTitle.includes('organize') || lowerTitle.includes('learn') || lowerTitle.includes('school') || lowerTitle.includes('note')) {
          tagsSet.add('#productivity');
          tagsSet.add('#education');
        }
        if (tagsSet.size === 0) {
          tagsSet.add('#general');
        }

        // 3. Determine Difficulty
        let difficulty: VaultResource['difficulty'] = 'Intermediate';
        if (lowerTitle.includes('intro') || lowerTitle.includes('basic') || lowerTitle.includes('beginner') || lowerTitle.includes('easy') || lowerTitle.includes('getting started')) {
          difficulty = 'Beginner';
        } else if (lowerTitle.includes('advanced') || lowerTitle.includes('master') || lowerTitle.includes('expert') || lowerTitle.includes('complex') || lowerTitle.includes('deep dive') || lowerTitle.includes('graduate')) {
          difficulty = 'Advanced';
        }

        const newResource: VaultResource = {
          id: `vault-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: title || 'Untitled Resource',
          url: url || '#',
          category,
          tags: Array.from(tagsSet),
          notes: notes || 'No custom notes provided.',
          difficulty,
          dateAdded: new Date().toISOString()
        };

        // Trigger background embedding API
        const user = auth.currentUser;
        const uid = user ? user.uid : (typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true' ? 'sandbox-user-id' : null);
        if (uid) {
          fetch('/api/vault/embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid,
              resourceId: newResource.id,
              title: newResource.title,
              notes: newResource.notes,
              category: newResource.category
            })
          }).catch(err => console.error('Failed to trigger background embedding:', err));
        }

        // Simulate a minor latency for the "AI Auto-Categorizing" feel
        await new Promise((resolve) => setTimeout(resolve, 1200));

        set((state) => ({
          resources: [newResource, ...state.resources]
        }));
      },
      deleteResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id)
        })),
      updateResource: (id, updates) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          )
        }))
    }),
    {
      name: 'life-os-vault',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
