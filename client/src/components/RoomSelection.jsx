import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Plus, MessageCircle, Wifi } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const rooms = [
  { name: 'Anime', description: 'Discuss your favorite anime and manga', icon: '🎌', category: 'entertainment', color: 'from-pink-500 to-rose-500' },
  { name: 'Coding', description: 'Programming and tech discussions', icon: '💻', category: 'tech', color: 'from-blue-500 to-cyan-500' },
  { name: 'General Chat', description: 'Casual conversations', icon: '💬', category: 'general', color: 'from-green-500 to-emerald-500' },
  { name: 'Sports', description: 'Sports and fitness talk', icon: '⚽', category: 'lifestyle', color: 'from-orange-500 to-amber-500' },
  { name: 'ChatGames', description: 'Games and fun activities', icon: '🎮', category: 'games', color: 'from-purple-500 to-violet-500' }
]

const RoomSelection = () => {
  const { session, signOut, profile } = useAuth()
  const navigate = useNavigate()
  const [customRoom, setCustomRoom] = useState('')

  const handleJoinRoom = (roomName) => {
    navigate(`/chat?room=${encodeURIComponent(roomName)}`)
  }

  const handleCreateCustomRoom = (e) => {
    e.preventDefault()
    if (customRoom.trim()) {
      handleJoinRoom(customRoom.trim())
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Hanaso!</h1>
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <Wifi size={14} />
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <span className="text-xl text-purple-700 dark:text-purple-300 hidden sm:inline">
                {profile?.username || session?.user?.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Choose a Room</h2>
          <p className="text-gray-600 dark:text-gray-400">Select a room to start chatting with AI and other learners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <button
              key={room.name}
              onClick={() => handleJoinRoom(room.name)}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${room.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {room.icon}
                </div>
                <MessageCircle size={20} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{room.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                  {room.category}
                </span>
                <span className="text-xs text-purple-500 dark:text-purple-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Join Room →
                </span>
              </div>
            </button>
          ))}

          {/* Custom Room */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-2xl">
                <Plus className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Custom Room</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your own room</p>
            <form onSubmit={handleCreateCustomRoom} className="flex gap-2">
              <input
                type="text"
                value={customRoom}
                onChange={(e) => setCustomRoom(e.target.value)}
                placeholder="Room name..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                type="submit"
                disabled={!customRoom.trim()}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RoomSelection
