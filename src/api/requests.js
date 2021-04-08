import Axios from 'axios/index'


export const requests = Axios.create({
  baseURL: 'http://127.0.0.1:8999/api/v1/',
  timeout: 3 * 60 * 1000
})
