import {requests} from "../requests"


export const resetPasswordRequest = data => {
  return requests.patch('/user-management/forgot-password', data)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const changePasswordRequest = (data, token) => {
  return requests.patch(
    '/user-management/update-password', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  )
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const changeEmailRequest = (data, token) => {
  return requests.patch(
    '/user-management/update-email', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
    )
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const closeUserRequest = (data, token) => {
  return requests.delete(
    '/user-management/destroy-user',
    {
      data: data,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  )
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
