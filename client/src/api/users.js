import api from './index'

export const searchUsers = async (query) => {
	const response = await api.get('/users/search', { params: { q: query } })
	return response.data
}

export const getUserProfile = async (identifier) => {
	const response = await api.get(`/users/${encodeURIComponent(identifier)}`)
	return response.data
}