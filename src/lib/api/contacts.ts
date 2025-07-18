import axios from '../axios'

export async function createContact(user: any) {
  const res = await axios.post(`/contacts`, {
    contactUserId: user.id,
    alias: user.name,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}

export async function getUserContacts() {
  const res = await axios.get('/contacts', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('yap_token')}`,
    },
  })

  return res.data
}
