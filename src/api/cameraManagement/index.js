import {requests} from '../requests'


export const createCameraGroupRequest = (data, token) => {
  return requests.post('camera-management' +
    '/camera-group/create', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const hasCameraGroupID = (data, token) => {
  return requests.get('camera-management' +
    '/camera-group/create', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const createCameraRequest = (data, token) => {
  return requests.post('camera-management' +
    '/camera/create', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const hasCameraID = (data, token) => {
  return requests.get('camera-management' +
    '/camera/create', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const getCameraGroupRequest = token => {
  return requests.get('camera-management' +
    '/camera-group/retrieve', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const getCameraRequest = (data, token) => {
  return requests.get('camera-management' +
    '/camera/retrieve', {
    params: data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const updateCameraGroupRequest = (data, token) => {
  return requests.patch('camera-management' +
    '/camera-group/update', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const updateCameraRequest = (data, token) => {
  return requests.patch('camera-management' +
    '/camera/update', data,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const deleteCameraGroupRequest = (data, token) => {
  return requests.delete('camera-management' +
    '/camera-group/delete', {
    data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const deleteCameraRequest = (data, token) => {
  return requests.delete('camera-management' +
    '/camera/delete', {
    data,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const cameraPreviewRequest = (data, token) => {
  return requests.get('camera-management' +
    '/camera/preview', {
    params: {
      'camera_id': data
    },
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const cameraSetAISkillSettingsRequest = (data, token) => {
  return requests.post('camera-management' +
    '/camera/set-ai-skill-settings', data, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const cameraSetExtractionSettingsRequest = (data, token) => {
  return requests.post('camera-management' +
    '/camera/set-extraction-settings', data, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const cameraStartRequest = (data, token) => {
  return requests.post('camera-management' +
    '/camera/start-task', data, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
  )
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const cameraStopRequest = (data, token) => {
  return requests.post('camera-management' +
    '/camera/stop-task', data, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
