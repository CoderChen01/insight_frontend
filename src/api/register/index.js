import {requests} from '../requests'


export const register = data => {
  return requests.post('/user-management/register', data)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

