import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import moment from 'moment';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const server = createServer(app);

// CORS for both Express and Socket.IO
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const io = new Server(server, { cors: corsOptions });

// Supabase clients
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// In-memory users per socket (for room management)
const socketUsers = new Map();

const botName = 'Hanasō!';

function formatMessage(username, text, userId = null, isAI = false) {
  return {
    username,
    text,
    userId,
    isAI,
    time: moment().format('h:mm a'),
    timestamp: new Date().toISOString()
  };
}

// JWT verification middleware for Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return next(new Error('Invalid token'));
    }

    // Fetch profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    socket.user = {
      id: user.id,
      email: user.email,
      username: profile?.username || user.email.split('@')[0],
      level: profile?.level || 'N5',
      avatar_url: profile?.avatar_url
    };

    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username} (${socket.user.id})`);

  socket.on('joinRoom', async ({ room }) => {
    const username = socket.user.username;
    const userId = socket.user.id;
    
    socket.join(room);
    socketUsers.set(socket.id, { id: socket.id, username, userId, room });

    // Load chat history from Supabase
    try {
      const { data: history } = await supabaseAdmin
        .from('messages')
        .select('content, username, user_id, is_ai, created_at')
        .eq('room', room)
        .order('created_at', { ascending: true })
        .limit(50);

      if (history) {
        const formattedHistory = history.map(m => ({
          username: m.is_ai ? '🤖 AI' : m.username,
          text: m.content,
          userId: m.user_id,
          isAI: m.is_ai,
          time: moment(m.created_at).format('h:mm a')
        }));
        socket.emit('chatHistory', formattedHistory);
      }
    } catch (error) {
      console.error('History load error:', error);
    }

    // Welcome message
    socket.emit('message', formatMessage(botName, `Welcome to ${room}, ${username}!`));

    // Notify others
    socket.broadcast.to(room).emit('message', formatMessage(botName, `${username} has joined the chat`));

    // Send user list
    const roomUsers = Array.from(socketUsers.values())
      .filter(u => u.room === room)
      .map(u => ({ id: u.id, username: u.username }));
    
    io.to(room).emit('roomUsers', { room, users: roomUsers });
  });

  socket.on('user-message', async (msg) => {
    const user = socketUsers.get(socket.id);
    if (!user) return;

    const { username, userId, room } = user;

    // Broadcast user message
    io.to(room).emit('message', formatMessage(username, msg, userId));

    // Save user message to Supabase
    await supabaseAdmin.from('messages').insert({
      content: msg,
      user_id: userId,
      username: username,
      room: room,
      language: 'en',
      is_ai: false
    });

    // AI reply
    try {
      const result = await model.generateContent(msg);
      const aiReply = await result.response.text();

      io.to(room).emit('message', formatMessage('🤖 AI', aiReply, null, true));

      // Save AI message
      await supabaseAdmin.from('messages').insert({
        content: aiReply,
        user_id: null,
        username: 'AI',
        room: room,
        language: 'en',
        is_ai: true
      });
    } catch (error) {
      console.error('AI error:', error);
      io.to(room).emit('message', formatMessage('AI', 'Sorry, I am having trouble thinking right now. Try again!', null, true));
    }
  });

  socket.on('typing', ({ isTyping }) => {
    const user = socketUsers.get(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit('typing', {
        username: user.username,
        isTyping
      });
    }
  });

  socket.on('disconnect', () => {
    const user = socketUsers.get(socket.id);
    if (user) {
      socketUsers.delete(socket.id);
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
      
      const roomUsers = Array.from(socketUsers.values())
        .filter(u => u.room === user.room)
        .map(u => ({ id: u.id, username: u.username }));
      
      io.to(user.room).emit('roomUsers', { room: user.room, users: roomUsers });
    }
    console.log(`User disconnected: ${socket.user?.username}`);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Hanaso! Server running on port ${PORT}`);
  console.log(`🔒 JWT Authentication enabled`);
  console.log(`🤖 Gemini AI integrated`);
});
