import {requests} from '../requests'


export const createAISkillGroupRequest = (data, token) => {
  return requests.post('interface-management' +
    '/ai-skill-group/create', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const hasAISkillGroupID = (data, token) => {
  return requests.get('interface-management' +
    '/ai-skill-group/create', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const createAISkillRequest = (data, token) => {
  return requests.post('interface-management' +
    '/ai-skill/create', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const hasAISkillID = (data, token) => {
  return requests.get('interface-management' +
    '/ai-skill/create', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const getAISkillGroupRequest = token => {
  return requests.get('interface-management' +
    '/ai-skill-group/retrieve', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const getAISkillRequest = (data, token) => {
  return requests.get('interface-management' +
    '/ai-skill/retrieve', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const updateAISkillGroupRequest = (data, token) => {
  return requests.patch('interface-management' +
    '/ai-skill-group/update', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const updateAISkillRequest = (data, token) => {
  return requests.patch('interface-management' +
    '/ai-skill/update', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const deleteAISkillGroupRequest = (data, token) => {
  return requests.delete('interface-management' +
    '/ai-skill-group/delete', {
    data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const deleteAISkillRequest = (data, token) => {
  return requests.delete('interface-management' +
    '/ai-skill/delete', {
    data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const refreshAISkillRequest = (data, token) => {
  return requests.patch('interface-management' +
    '/ai-skill/update-state', data, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
