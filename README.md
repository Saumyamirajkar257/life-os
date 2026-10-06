# ✦ AURA LIFE OS

> **The Sovereign Executive Command Center & Mindful Life Management System**

Aura is a high-performance, local-first personal operating system designed to unify daily focus, task execution, time management, habit tracking, deep journaling, personal finance, and cognitive analytics into a single, cohesive interface.

---

## ⚡ Features

- **🌐 Executive Overview & Command Center**: Real-time cockpit summarizing daily priorities, upcoming schedule, active habits, financial pulse, and productivity score.
- **✓ Tasks & Workflow Engine**: Matrix prioritization (Eisenhower), Kanban boards, list views, and tag-based organization.
- **📅 Time-Blocking & Calendar**: Seamless daily, weekly, and monthly schedule visualization with integrated planner view.
- **🔥 Habits & Routine Tracking**: Streak tracking, completion rates, and time-of-day grouping for sustainable ritual formation.
- **📝 Mindful Journal & Notes**: Rich TipTap-powered editor with timeline history, sentiment tagging, and reflection prompts.
- **💰 Finance & Wealth Management**: Account balances, expense tracking, categorized budgets, and visual savings goals.
- **📊 Cognitive Analytics & Intelligence**: Domain health scores, habit consistency trends, productivity charts, and weekly reviews.
- **✨ Aura AI Assistant**: Context-aware personal intelligence copilot powered by the Gemini SDK.
- **🔒 Local-First Sovereignty**: Zero-latency offline operation with Zustand persistence, coupled with deferred/lazy-loaded Firebase synchronization.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Glassmorphic Design System
- **State Management**: Zustand (Local-first with selective persistence)
- **Editor**: TipTap Pro Suite (Rich Text, Tables, Task lists)
- **Charts**: Recharts & Motion animations
- **AI**: Google Gen AI SDK (`@google/genai`)
- **Cloud & Sync**: Firebase Auth (eager) & Cloud Firestore (lazy-loaded on demand)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Saumyamirajkar257/aura-life-os.git
   cd aura-life-os
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and add your keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to launch Aura.

---

## ☁️ Deployment

### Cloudflare Pages (Recommended)

Aura is pre-configured for frictionless deployment to **Cloudflare Pages**:

1. **Build settings**:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
2. **SPA Routing**:
   - Aura includes `public/_redirects` (`/* /index.html 200`) so all client-side routes (`/overview`, `/tasks`, `/calendar`, `/habits`, `/journal`, `/finance`, `/analytics`) resolve smoothly without 404s.
3. **Environment variables**:
   - Add your Firebase and Gemini credentials under **Settings > Environment variables** in your Cloudflare dashboard.

---

## 📄 License

MIT © [Saumya Mirajkar](https://github.com/Saumyamirajkar257)
