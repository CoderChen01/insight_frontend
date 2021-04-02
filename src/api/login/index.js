import {requests} from '../requests'

export const loginRequest = data => {
  return requests.post('/user-management/login', data)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const isExpired = token => {
  return requests.get('/user-management/is-expired', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
