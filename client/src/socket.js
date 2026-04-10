import { io } from 'socket.io-client'

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

export const createSocket = (token) => {
  return io(getSocketUrl(), {
    autoConnect: false,
    auth: {
      token
    }
  })
}

export default createSocket