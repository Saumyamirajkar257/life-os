import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFirestoreStorage } from '@/lib/firestoreStorage';

export interface Friend {
  id: string;
  name: string;
  college: string;
  online: boolean;
  isFriend: boolean;
  screenTime: string;
  appsBreakdown: string;
  pfp?: string;
}

export interface FriendRequest {
  id: string;
  username: string;
  type: 'incoming' | 'outgoing';
  college?: string;
  online?: boolean;
  screenTime?: string;
  appsBreakdown?: string;
  pfp?: string;
}

interface FriendsState {
  friendsList: Friend[];
  friendRequests: FriendRequest[];
  toggleFriendship: (id: string) => void;
  addFriend: (name: string) => void;
  sendFriendRequest: (username: string) => void;
  acceptFriendRequest: (id: string) => void;
  declineFriendRequest: (id: string) => void;
  cancelFriendRequest: (id: string) => void;
}

const PFP_PRESETS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="40" stroke="%23818cf8" stroke-width="6" stroke-dasharray="10 5" fill="none"/><circle cx="50" cy="50" r="24" stroke="%23c084fc" stroke-width="4" fill="none"/><circle cx="50" cy="50" r="10" fill="%23818cf8"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><rect x="20" y="20" width="60" height="60" rx="10" stroke="%2310b981" stroke-width="5" fill="none"/><circle cx="50" cy="50" r="12" fill="%2314b8a6"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><path d="M50,15 L85,75 L15,75 Z" stroke="%23f59e0b" stroke-width="5" fill="none" stroke-linejoin="round"/><circle cx="50" cy="58" r="10" fill="%23f97316"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="35" stroke="%23f43f5e" stroke-width="5" stroke-dasharray="2 6" fill="none"/><circle cx="50" cy="50" r="20" fill="%23e11d48"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="38" stroke="%238b5cf6" stroke-width="4" stroke-dasharray="5 5" fill="none"/><rect x="35" y="35" width="30" height="30" rx="6" stroke="%23ec4899" stroke-width="4" fill="none"/><circle cx="50" cy="50" r="6" fill="%238b5cf6"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><path d="M15,15 L85,15 L85,85 L15,85 Z" stroke="%23f97316" stroke-width="4" stroke-dasharray="8 4" fill="none"/><circle cx="50" cy="50" r="20" stroke="%23ef4444" stroke-width="3" fill="none"/><polygon points="45,45 55,50 45,55" fill="%23f97316"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><polygon points="50,15 85,45 70,85 30,85 15,45" stroke="%2306b6d4" stroke-width="5" fill="none"/><circle cx="50" cy="55" r="15" stroke="%233b82f6" stroke-width="3" fill="none"/><circle cx="50" cy="55" r="5" fill="%2306b6d4"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="40" stroke="%23ef4444" stroke-width="5" stroke-dasharray="12 6" fill="none"/><path d="M30,30 L70,70 M70,30 L30,70" stroke="%23f43f5e" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="%23ef4444"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><rect x="25" y="25" width="50" height="50" rx="12" stroke="%2384cc16" stroke-width="5" stroke-dasharray="10 5" fill="none"/><circle cx="50" cy="50" r="15" stroke="%2310b981" stroke-width="3" fill="none"/><circle cx="50" cy="50" r="6" fill="%2384cc16"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="36" stroke="%23eab308" stroke-width="6" fill="none"/><path d="M50,25 L50,75 M25,50 L75,50" stroke="%23f59e0b" stroke-width="4"/><circle cx="50" cy="50" r="8" fill="%23eab308"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><polygon points="50,10 90,80 10,80" stroke="%2310b981" stroke-width="6" stroke-dasharray="15 5" fill="none"/><circle cx="50" cy="55" r="18" fill="%23059669"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230c0a09"/><circle cx="50" cy="50" r="38" stroke="%23d946ef" stroke-width="5" fill="none"/><rect x="38" y="38" width="24" height="24" rx="4" stroke="%23a855f7" stroke-width="4" stroke-dasharray="4 2" fill="none"/><circle cx="50" cy="50" r="6" fill="%23d946ef"/></svg>'
];

const initialFriendsList: Friend[] = [
  { id: '1', name: 'Swaraj', college: 'Stanford', online: true, isFriend: true, screenTime: '10:45:52', appsBreakdown: 'cursor.sh: 8h • github.com: 2h 45m', pfp: PFP_PRESETS[0] },
  { id: '2', name: 'Rucha', college: 'MIT', online: true, isFriend: true, screenTime: '10:21:55', appsBreakdown: 'figma.com: 6h • linear.app: 4h 21m', pfp: PFP_PRESETS[1] },
  { id: '3', name: 'NotSwaraj', college: 'Oxford', online: true, isFriend: true, screenTime: '7:31:53', appsBreakdown: 'vscode: 5h • youtube.com: 2h 31m', pfp: PFP_PRESETS[2] },
  { id: '4', name: 'aarryya', college: 'UCLA', online: true, isFriend: true, screenTime: '7:21:22', appsBreakdown: 'notion.so: 4h • cursor.sh: 3h 21m', pfp: PFP_PRESETS[3] },
  { id: '5', name: 'anaya', college: 'UC Berkeley', online: false, isFriend: true, screenTime: '6:19:06', appsBreakdown: 'slack.com: 3h • github.com: 3h 19m', pfp: PFP_PRESETS[4] },
  { id: '6', name: 'Soojit', college: 'Cambridge', online: true, isFriend: true, screenTime: '5:46:01', appsBreakdown: 'x.com: 2h • discord.com: 3h 46m', pfp: PFP_PRESETS[5] },
  { id: '7', name: 'Akshara', college: 'Harvard', online: false, isFriend: true, screenTime: '5:17:26', appsBreakdown: 'leetcode.com: 4h • medium.com: 1h 17m', pfp: PFP_PRESETS[6] },
  { id: '8', name: 'Sarthak', college: 'IIT Bombay', online: true, isFriend: false, screenTime: '5:16:29', appsBreakdown: 'x.com: 1h • youtube.com: 4h 16m', pfp: PFP_PRESETS[7] },
  { id: '9', name: 'vviinneell', college: 'Yale', online: true, isFriend: true, screenTime: '5:00:03', appsBreakdown: 'cursor.sh: 4h • stackoverflow.com: 1h', pfp: PFP_PRESETS[8] },
  { id: '10', name: 'hiiamharsh', college: 'Delhi University', online: true, isFriend: false, screenTime: '4:35:43', appsBreakdown: 'spotify.com: 2h • discord.com: 2h 35m', pfp: PFP_PRESETS[9] },
  { id: '11', name: 'radhika w.', college: 'Columbia', online: false, isFriend: false, screenTime: '3:25:55', appsBreakdown: 'instagram.com: 2h • x.com: 1h 25m', pfp: PFP_PRESETS[10] },
  { id: '12', name: 'Gargi Kulk', college: 'Stanford', online: true, isFriend: true, screenTime: '0:34:56', appsBreakdown: 'notion.so: 30m • chatgpt.com: 4m', pfp: PFP_PRESETS[11] },
  { id: '13', name: 'komald_2', college: 'MIT', online: false, isFriend: false, screenTime: '0:00:02', appsBreakdown: 'cursor.sh: 2s', pfp: PFP_PRESETS[0] },
  { id: '14', name: 'Ranveer', college: 'UCLA', online: false, isFriend: false, screenTime: '0:00:00', appsBreakdown: 'idle', pfp: PFP_PRESETS[1] },
  { id: '15', name: 'Ak00000', college: 'Georgia Tech', online: false, isFriend: false, screenTime: '0:00:00', appsBreakdown: 'idle', pfp: PFP_PRESETS[2] },
  { id: '16', name: 'Patil Ojas', college: 'IIT Delhi', online: false, isFriend: false, screenTime: '0:00:00', appsBreakdown: 'idle', pfp: PFP_PRESETS[3] }
];

const initialFriendRequests: FriendRequest[] = [
  { id: 'req-1', username: 'Sam_257', type: 'incoming', college: 'Stanford University', online: true, screenTime: '4:15:32', appsBreakdown: 'cursor.sh: 3h • x.com: 1h 15m', pfp: PFP_PRESETS[4] },
  { id: 'req-2', username: 'neo_coder', type: 'incoming', college: 'MIT', online: false, screenTime: '1:10:05', appsBreakdown: 'vscode: 1h 10m', pfp: PFP_PRESETS[5] },
  { id: 'req-3', username: 'alexa_flow', type: 'outgoing', pfp: PFP_PRESETS[6] }
];

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set) => ({
      friendsList: initialFriendsList,
      friendRequests: initialFriendRequests,
      toggleFriendship: (id) =>
        set((state) => ({
          friendsList: state.friendsList.map((friend) =>
            friend.id === id ? { ...friend, isFriend: !friend.isFriend } : friend
          ),
        })),
      addFriend: (name) =>
        set((state) => {
          const existing = state.friendsList.find((f) => f.name.toLowerCase() === name.toLowerCase());
          if (existing) {
            return {
              friendsList: state.friendsList.map((f) =>
                f.id === existing.id ? { ...f, isFriend: true } : f
              ),
            };
          }
          const randomHours = Math.floor(Math.random() * 3) + 1;
          const randomMins = Math.floor(Math.random() * 55);
          const randomPfp = PFP_PRESETS[Math.floor(Math.random() * PFP_PRESETS.length)];
          const newFriend: Friend = {
            id: `friend-${Date.now()}`,
            name,
            college: 'External Node',
            online: Math.random() > 0.5,
            isFriend: true,
            screenTime: `${randomHours}:${randomMins}:00`,
            appsBreakdown: 'blocked-sites.com: 15m • lifeos.ai: 2h',
            pfp: randomPfp,
          };
          return {
            friendsList: [...state.friendsList, newFriend],
          };
        }),
      sendFriendRequest: (username) =>
        set((state) => {
          // Check if already a request
          if (state.friendRequests.some((r) => r.username.toLowerCase() === username.toLowerCase())) {
            return {};
          }
          const randomPfp = PFP_PRESETS[Math.floor(Math.random() * PFP_PRESETS.length)];
          const newRequest: FriendRequest = {
            id: `req-${Date.now()}`,
            username,
            type: 'outgoing',
            pfp: randomPfp,
          };
          return {
            friendRequests: [...state.friendRequests, newRequest],
          };
        }),
      acceptFriendRequest: (id) =>
        set((state) => {
          const request = state.friendRequests.find((r) => r.id === id);
          if (!request) return {};

          // Add to friendsList
          const existingFriend = state.friendsList.find((f) => f.name.toLowerCase() === request.username.toLowerCase());
          let updatedFriends = [...state.friendsList];
          
          if (existingFriend) {
            updatedFriends = state.friendsList.map((f) =>
              f.id === existingFriend.id ? { ...f, isFriend: true } : f
            );
          } else {
            const randomPfp = request.pfp || PFP_PRESETS[Math.floor(Math.random() * PFP_PRESETS.length)];
            updatedFriends.push({
              id: `friend-${Date.now()}`,
              name: request.username,
              college: request.college || 'External Node',
              online: request.online ?? true,
              isFriend: true,
              screenTime: request.screenTime || '2:30:00',
              appsBreakdown: request.appsBreakdown || 'cursor.sh: 2h • lifeos.ai: 30m',
              pfp: randomPfp,
            });
          }

          return {
            friendsList: updatedFriends,
            friendRequests: state.friendRequests.filter((r) => r.id !== id),
          };
        }),
      declineFriendRequest: (id) =>
        set((state) => ({
          friendRequests: state.friendRequests.filter((r) => r.id !== id),
        })),
      cancelFriendRequest: (id) =>
        set((state) => ({
          friendRequests: state.friendRequests.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'life-os-friends',
      storage: createJSONStorage(() => createFirestoreStorage()),
      skipHydration: true,
    }
  )
);
