# Hanaso! - Requirements & Setup Guide

## 📋 Required Software

### Essential
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| npm | 10+ | Package manager (comes with Node) |
| Git | 2.x | Version control |

### Optional (Recommended)
| Software | Purpose |
|----------|---------|
| VS Code | Code editor |
| PostgreSQL knowledge | Database understanding |
| Supabase CLI | Local development |

## 🖥️ System Requirements

- **Operating System**: Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 500MB for project + node_modules
- **Browser**: Chrome, Firefox, Edge (latest versions)

## 📥 Installation Steps

### 1. Install Node.js
```bash
# Windows (using nvm-windows)
nvm install 20
nvm use 20

# macOS/Linux (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

Verify installation:
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### 2. Clone Project
```bash
git clone your-repo-url
cd chat-room
```

### 3. Install Dependencies
```bash
npm install
```

This installs:
- Root: concurrently
- Client: react, react-dom, socket.io-client, tailwindcss, vite, @supabase/supabase-js
- Server: express, socket.io, @supabase/supabase-js, @google/generative-ai, helmet

### 4. Supabase Setup

#### Option A: Cloud (Recommended for beginners)
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: hanaso-chat
4. Generate password, wait for setup (1-2 mins)
5. Go to Settings → API
6. Copy Project URL
7. Copy anon public key
8. Click "Generate new key" → Copy service_role key

#### Option B: Local Development
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize
supabase init
supabase start
```

### 5. Database Setup

In Supabase Dashboard:
1. Go to SQL Editor
2. Copy and paste contents of `SUPABASE_SETUP.sql`
3. Click "Run"

This creates:
- `profiles` table with user data
- `messages` table with chat history
- Row Level Security policies
- Auto profile creation trigger

### 6. Environment Configuration

Create/Edit `.env` in root:
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=AIzaSyADv17Fg2ED9jD4fWYfQJ7HpgiSojPFl3Q
```

Create/Edit `client/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 How to Test Locally

### Start Development Servers
```bash
npm run dev
```

Expected output:
```
✓ Client running at http://localhost:5173
✓ Server running at http://localhost:5000
```

### Test Authentication
1. Open http://localhost:5173
2. Click "Create Account"
3. Enter username, email, password
4. Should redirect to /rooms

### Test Chat
1. Select a room (e.g., "Anime")
2. Type a message
3. Should see:
   - Your message appear
   - AI response (Gemini) in 1-2 seconds
   - Typing indicator when AI is "thinking"

### Test Features
- [ ] Dark/Light mode toggle
- [ ] Room switching via sidebar
- [ ] Typing indicators
- [ ] User list updates
- [ ] Message persistence (refresh page)

## 🚀 Deployment Steps

### Frontend (Vercel - Free)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Add environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
5. Deploy!

### Backend (Render/Railway)
Render (recommended for Socket.IO):
1. Push code to GitHub
2. Connect to Render
3. Set environment variables as in .env
4. Build command: npm install
5. Start command: node server/index.js

### Database
Supabase is already cloud-hosted!
- Free tier: 500MB, 2 concurrent connections
- No setup needed beyond getting keys

## 🔧 Troubleshooting

### Common Issues

#### "MODULE_NOT_FOUND"
```bash
npm install
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm install
```

#### "Supabase connection error"
- Check .env file has correct keys
- Verify SUPABASE_URL format: https://xxxxx.supabase.co
- Check network connectivity

#### "CORS error"
- Update corsOptions in server/index.js to match your frontend URL
- For production, use actual domain instead of localhost

#### "AI not responding"
- Check GEMINI_API_KEY in .env
- Verify billing account at Google AI Studio
- Check server console for errors

#### "Port already in use"
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it or use different port in .env
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Socket.IO Documentation](https://socket.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Gemini API](https://ai.google.dev/docs/gemini)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues
- Review server/client logs for error details

---

Last updated: 2025 | Version 1.0.0
