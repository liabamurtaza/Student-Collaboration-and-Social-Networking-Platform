// users API calls will go here
import axios from 'axios'

const getToken = () => localStorage.getItem('token')

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
})

// Get any user's profile
export const getUser = (id) =>
  axios.get(`/api/users/${id}`).then(res => res.data)

// Update own profile (name, bio)
export const updateUser = (id, data) =>
  axios.put(`/api/users/${id}`, data, authHeader()).then(res => res.data)

// Follow a user
export const followUser = (id) =>
  axios.put(`/api/users/${id}/follow`, {}, authHeader()).then(res => res.data)

// Unfollow a user
export const unfollowUser = (id) =>
  axios.put(`/api/users/${id}/unfollow`, {}, authHeader()).then(res => res.data)