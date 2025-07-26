import axios from '../axios'

export async function sendMessage(data: {
  contactID: number
  message: string
}) {
  const res = await axios.post(`/messages`, {
    contactID: data.contactID,
    message: data.message,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}
