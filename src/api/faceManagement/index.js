import {requests} from '../requests'


export const createFaceGroupRequest = (data, token) => {
  return requests.post('face-management' +
    '/face-group/create', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const hasFaceGroupID = (data, token) => {
  return requests.get('face-management' +
    '/face-group/create', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const createFaceRequest = (data, token) => {
  return requests.post('face-management' +
    '/face/create', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const hasFaceID = (data, token) => {
  return requests.get('face-management' +
    '/face/create', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const getFaceGroupRequest = token => {
  return requests.get('face-management' +
    '/face-group/retrieve', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const getFaceRequest = (data, token) => {
  return requests.get('face-management' +
    '/face/retrieve', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const updateFaceGroupRequest = (data, token) => {
  return requests.patch('face-management' +
    '/face-group/update', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const updateFaceRequest = (data, token) => {
  return requests.patch('face-management' +
    '/face/update', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const deleteFaceGroupRequest = (data, token) => {
  return requests.delete('face-management' +
    '/face-group/delete', {
    data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const deleteFaceRequest = (data, token) => {
  return requests.delete('face-management' +
    '/face/delete', {
    data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
