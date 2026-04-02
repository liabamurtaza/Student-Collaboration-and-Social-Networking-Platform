import api from './index'

export const likePost = async (postId) => {
  const response = await api.put(`/posts/${postId}/like`)
  return response.data
}