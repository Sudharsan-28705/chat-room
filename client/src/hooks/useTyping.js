import { useState, useEffect, useRef } from 'react'

export const useTyping = (socket, username, room) => {
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const timeoutRef = useRef(null)

  const sendTyping = (typing) => {
    socket.emit('typing', { isTyping: typing })
  }

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      sendTyping(true)
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTyping(false)
    }, 1500)
  }

  useEffect(() => {
    socket.on('typing', ({ username: typer, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => new Set(prev).add(typer))
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(typer)
          return newSet
        })
      }
    })

    return () => {
      socket.off('typing')
    }
  }, [socket])

  return { isTyping, typingUsers, handleTyping }
}

