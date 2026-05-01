import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { Moon, Sun, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeProvider'

const ChatRoom = () => {
  const { session, signOut, profile } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const room = searchParams.get('room') || 'General Chat'
  const username = profile?.username || session?.user?.email?.split('@')[0] || 'User'

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [typingUsers, setTypingUsers] = useState(new Set())
  
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    if (!session) {
      navigate('/')
      return
    }

    socketRef.current = io('http://localhost:5000', {
      auth: { token: session.access_token }
    })

    socketRef.current.emit('joinRoom', { room })

    socketRef.current.on('chatHistory', (history) => {
      setMessages(history)
    })

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message])
    })

    socketRef.current.on('roomUsers', ({ room: r, users: u }) => {
      setUsers(u)
    })

    socketRef.current.on('typing', ({ username: typer, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        if (isTyping) newSet.add(typer)
        else newSet.delete(typer)
        return newSet
      })
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [session, room, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('user-message', message)
      setMessage('')
    }
  }

  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setMessage(value)

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    if (value.length > 0) {
      socketRef.current?.emit('typing', { isTyping: true })
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { isTyping: false })
      }, 1000)
    } else {
      socketRef.current?.emit('typing', { isTyping: false })
    }
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleExit = () => {
    navigate('/rooms')
  }

  const typingUsersArray = Array.from(typingUsers)

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-indigo-100 text-gray-900'}`}>
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleExit} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="font-bold text-white text-lg">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Hanaso!
            </h1>
            <p className="text-sm opacity-75">{room}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 p-6 hidden md:block">
          <h3 className="font-semibold mb-4 text-lg border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
            Room: {room}
          </h3>
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Users ({users.length})
          </h4>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Messages Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {typingUsersArray.length > 0 && (
              <div className="flex flex-col items-start p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                <span className="text-sm opacity-75">
                  {typingUsersArray.length === 1 
                    ? `${typingUsersArray[0]} is typing...`
                    : `${typingUsersArray.length} users typing...`
                  }
                </span>
                <div className="flex gap-1 mt-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-4 rounded-2xl shadow-lg ${msg.username === username 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 rounded-bl-sm'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm opacity-90">
                      {msg.isAI ? '🤖 AI' : msg.username}
                    </span>
                    <span className="text-xs opacity-60">{msg.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default ChatRoom
