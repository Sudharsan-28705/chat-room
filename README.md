# Hanaso! 🌸

A production-ready real-time chat application with AI integration for language learning.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)

## 🌟 Features

### Core Features
- **Real-time Chat** - Socket.IO powered instant messaging
- **AI Integration** - Gemini AI for auto-responses, grammar correction, and language explanations
- **Supabase Backend** - Authentication, PostgreSQL database, Row Level Security
- **Room System** - Multiple chat rooms (Anime, Coding, General Chat, Sports, ChatGames)
- **Custom Rooms** - Create your own rooms

### UI/UX
- **Modern Interface** - Discord/WhatsApp inspired design
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Smooth Animations** - Polished transitions and feedback

### Technical
- **JWT Authentication** - Secure session handling
- **Typing Indicators** - See when others are typing
- **Message History** - Chat history per room
- **AI Fallbacks** - Robust error handling

## 🏗️ Architecture

```
Hanaso/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components (Login, ChatRoom, RoomSelection)
│   │   ├── contexts/    # Auth & Theme providers
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Supabase client
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express Backend
│   ├── index.js         # Main server & Socket.IO
│   ├── services/       # AI service (Gemini)
│   └── utils/        # Utilities
│
├── SUPABASE_SETUP.sql  # Database schema
├── .env              # Environment variables
└── README.md
```

## 🚀 Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the project**
   ```bash
   git clone your-repo
   cd chat-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Create project at [supabase.com](https://supabase.com)
   - Go to SQL Editor
   - Run the queries in `SUPABASE_SETUP.sql`
   - Get your URL and keys from Settings → API

4. **Configure Environment**
   
   Server (.env):
   ```env
   NODE_ENV=development
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   GEMINI_API_KEY=your-gemini-key
   ```
   
   Client (.env):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 💬 How It Works

### Authentication Flow
1. User enters email/password on login page
2. Supabase Auth verifies credentials
3. JWT token stored in session
4. Token passed to Socket.IO for room access

### Chat Flow
1. User joins room → Socket.IO joins room
2. Load last 50 messages from Supabase
3. User sends message → broadcasts to room + saves to DB
4. Gemini AI generates response → broadcasts + saves to DB
5. Other users see messages in real-time

### AI Integration
- Every user message triggers AI response
- Gemini Pro model generates contextual replies
- Falls back gracefully on API errors
- Messages saved with is_ai flag

## 📡 API Integration

### Endpoints
- `GET /api/health` - Health check

### Socket.IO Events
- `joinRoom({ room })` - Join a chat room
- `user-message({ message })` - Send message
- `typing({ isTyping })` - Typing indicator
- `chatHistory` - Previous messages (emitted on join)
- `message` - New message received
- `roomUsers` - Users in room update

### Supabase Tables
- `profiles` - User profiles (username, level, preferences)
- `messages` - Chat history (content, room, language, is_ai)

## 🛠️ Technologies

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express, Socket.IO |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth, JWT |
| AI | Google Gemini Pro |

## 📝 Scripts

```bash
npm run dev      # Run both client and server
npm run build   # Build client for production
npm run preview # Preview production build
```

## 🔒 Security

- JWT token verification on Socket connection
- Supabase Row Level Security policies
- Helmet.js for HTTP headers
- Input sanitization
- Rate limiting ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io) - Real-time engine
- [Supabase](https://supabase.com) - Open source Firebase alternative
- [Google Gemini](https://deepmind.google/technologies/gemini) - AI model

---

Built with ❤️ for language learners worldwide.
