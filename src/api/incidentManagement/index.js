import {requests} from '../requests'

export const getIncidentRequest = (data, token) => {
  return requests.get('/incident-management/incident/retrieve', {
    params: data,
    headers: {
    'Authorization': 'Bearer ' + token
  }
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

// export const deleteIncidentRequest = (data, token) => {
//   return requests.delete('/incident-management/incident/delete', {
//     data,
//     headers: {
//       'Authorization': 'Bearer ' + token
//     }
//   })
//     .then(res => res.data)
//     .catch(err => Promise.reject(err))
// }
//
// export const deleteAllIncidentsRequest = (data, token) => {
//   return requests.delete('/incident-management/incident/delete-all-incidents', {
//     data,
//     headers: {
//       'Authorization': 'Bearer ' + token
//     }
//   })
//     .then(res => res.data)
//     .catch(err => Promise.reject(err))
// }