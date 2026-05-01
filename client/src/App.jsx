import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import RoomSelection from './components/RoomSelection.jsx'
import ChatRoom from './components/ChatRoom.jsx'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={!session ? <Login /> : <Navigate to="/rooms" />} />
        <Route path="/rooms" element={session ? <RoomSelection /> : <Navigate to="/" />} />
        <Route path="/chat" element={session ? <ChatRoom /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
