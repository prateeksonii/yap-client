import axios from '../axios'

export async function getUserChats() {
  const res = await axios.get('/chats', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}
