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
}

export interface FriendRequest {
  id: string;
  username: string;
  type: 'incoming' | 'outgoing';
  college?: string;
  online?: boolean;
  screenTime?: string;
  appsBreakdown?: string;
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

const initialFriendsList: Friend[] = [
  { id: '1', name: 'Swaraj', college: 'Stanford', online: true, isFriend: true, screenTime: '10:45:52', appsBreakdown: 'cursor.sh: 8h • github.com: 2h 45m' },
  { id: '2', name: 'Rucha', college: 'MIT', online: true, isFriend: true, screenTime: '10:21:55', appsBreakdown: 'figma.com: 6h • linear.app: 4h 21m' },
  { id: '3', name: 'NotSwaraj', college: 'Oxford', online: true, isFriend: true, screenTime: '7:31:53', appsBreakdown: 'vscode: 5h • youtube.com: 2h 31m' },
  { id: '4', name: 'aarryya', college: 'UCLA', online: true, isFriend: true, screenTime: '7:21:22', appsBreakdown: 'notion.so: 4h • cursor.sh: 3h 21m' },
  { id: '5', name: 'anaya', college: 'UC Berkeley', online: false, isFriend: true, screenTime: '6:19:06', appsBreakdown: 'slack.com: 3h • github.com: 3h 19m' },
  { id: '6', name: 'Soojit', college: 'Cambridge', online: true, isFriend: true, screenTime: '5:46:01', appsBreakdown: 'x.com: 2h • discord.com: 3h 46m' },
  { id: '7', name: 'Akshara', college: 'Harvard', online: false, isFriend: true, screenTime: '5:17:26', appsBreakdown: 'leetcode.com: 4h • medium.com: 1h 17m' },
  { id: '8', name: 'Sarthak', college: 'IIT Bombay', online: true, isFriend: false, screenTime: '5:16:29', appsBreakdown: 'x.com: 1h • youtube.com: 4h 16m' },
  { id: '9', name: 'vviinneell', college: 'Yale', online: true, isFriend: true, screenTime: '5:00:03', appsBreakdown: 'cursor.sh: 4h • stackoverflow.com: 1h' },
  { id: '10', name: 'hiiamharsh', college: 'Delhi University', online: true, isFriend: false, screenTime: '4:35:43', appsBreakdown: 'spotify.com: 2h • discord.com: 2h 35m' },
  { id: '11', name: 'radhika w.', college: 'Columbia', online: false, isFriend: false, screenTime: '3:25:55', appsBreakdown: 'instagram.com: 2h • x.com: 1h 25m' },
  { id: '12', name: 'Gargi Kulk', college: 'Stanford', online: true, isFriend: true, screenTime: '0:34:56', appsBreakdown: 'notion.so: 30m • chatgpt.com: 4m' },
  { id: '13', name: 'komald_2', college: 'MIT', online: false, isFriend: false, screenTime: '0:00:02', appsBreakdown: 'cursor.sh: 2s' },
  { id: '14', name: 'Ranveer', college: 'UCLA', online: false, isFriend: false, screenTime: '0:00:00', appsBreakdown: 'idle' },
  { id: '15', name: 'Ak00000', college: 'Georgia Tech', online: false, isFriend: false, screenTime: '0:00:00', appsBreakdown: 'idle' },
  { id: '16', name: 'Patil Ojas', college: 'IIT Delhi', online: false, isFriend: false, screenTime: '0:00:00', appsBreakdown: 'idle' }
];

const initialFriendRequests: FriendRequest[] = [
  { id: 'req-1', username: 'Sam_257', type: 'incoming', college: 'Stanford University', online: true, screenTime: '4:15:32', appsBreakdown: 'cursor.sh: 3h • x.com: 1h 15m' },
  { id: 'req-2', username: 'neo_coder', type: 'incoming', college: 'MIT', online: false, screenTime: '1:10:05', appsBreakdown: 'vscode: 1h 10m' },
  { id: 'req-3', username: 'alexa_flow', type: 'outgoing' }
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
          const newFriend: Friend = {
            id: `friend-${Date.now()}`,
            name,
            college: 'External Node',
            online: Math.random() > 0.5,
            isFriend: true,
            screenTime: `${randomHours}:${randomMins}:00`,
            appsBreakdown: 'blocked-sites.com: 15m • lifeos.ai: 2h',
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
          const newRequest: FriendRequest = {
            id: `req-${Date.now()}`,
            username,
            type: 'outgoing',
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
            updatedFriends.push({
              id: `friend-${Date.now()}`,
              name: request.username,
              college: request.college || 'External Node',
              online: request.online ?? true,
              isFriend: true,
              screenTime: request.screenTime || '2:30:00',
              appsBreakdown: request.appsBreakdown || 'cursor.sh: 2h • lifeos.ai: 30m',
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
