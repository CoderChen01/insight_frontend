import {requests} from "../requests"

export const hasUser = data => {
  return requests.get('/user-management/register', {params: data})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

export const sendCaptcha = data => {
  return requests.get('/user-management/send-email-captcha', {params: data})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}