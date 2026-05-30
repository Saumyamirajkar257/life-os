import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export type NodeType = 'note' | 'idea' | 'resource' | 'bookmark';

export interface KnowledgeNode {
  id: string;
  title: string;
  content: string;
  type: NodeType;
  tags: string[];
  connections: string[]; // IDs of related nodes
  url?: string;
  createdAt: string;
  updatedAt: string;
}

interface BrainState {
  nodes: KnowledgeNode[];
  searchQuery: string;
  activeFilter: NodeType | 'all';
  addNode: (node: Omit<KnowledgeNode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNode: (id: string, updates: Partial<KnowledgeNode>) => void;
  deleteNode: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: NodeType | 'all') => void;
  connectNodes: (id1: string, id2: string) => void;
}

const initialNodes: KnowledgeNode[] = [];

export const useBrainStore = create<BrainState>()(
  persist(
    (set) => ({
      nodes: initialNodes,
      searchQuery: '',
      activeFilter: 'all',
      
      addNode: (node) => set((state) => {
        const newNode: KnowledgeNode = {
          ...node,
          id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { nodes: [newNode, ...state.nodes] };
      }),
      
      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map((node) => 
          node.id === id 
            ? { ...node, ...updates, updatedAt: new Date().toISOString() } 
            : node
        )
      })),
      
      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes
            .filter((node) => node.id !== id)
            .map((n) => ({
              ...n,
              connections: n.connections.filter((cId) => cId !== id),
            })),
        })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      
      connectNodes: (id1, id2) => set((state) => {
        return {
          nodes: state.nodes.map(node => {
            if (node.id === id1 && !node.connections.includes(id2)) {
              return { ...node, connections: [...node.connections, id2] };
            }
            if (node.id === id2 && !node.connections.includes(id1)) {
              return { ...node, connections: [...node.connections, id1] };
            }
            return node;
          })
        };
      })
    }),
    {
      name: 'life-os-brain',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
