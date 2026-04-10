import { createContext, useEffect, useRef, useState } from 'react'
import createSocket from '../socket'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const socketRef = useRef(null)
  const [socket, setSocket] = useState(null)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    return token ? { token } : null
  })

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setSocket(null)
    }
  }

  useEffect(() => {
    const token = user?.token

    if (!token) {
      return undefined
    }

    const socketInstance = createSocket(token)
    const handleConnect = () => setSocket(socketInstance)
    const handleDisconnect = () => {
      if (socketRef.current === socketInstance) {
        socketRef.current = null
        setSocket(null)
      }
    }

    socketRef.current = socketInstance
    socketInstance.on('connect', handleConnect)
    socketInstance.on('disconnect', handleDisconnect)
    socketInstance.connect()

    return () => {
      socketInstance.off('connect', handleConnect)
      socketInstance.off('disconnect', handleDisconnect)
      socketInstance.disconnect()
      if (socketRef.current === socketInstance) {
        socketRef.current = null
      }
    }
  }, [user?.token])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    setUser(userData || { token })
  }

  const logout = () => {
    localStorage.removeItem('token')
    disconnectSocket()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext