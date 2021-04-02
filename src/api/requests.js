import Axios from 'axios/index'


export const requests = Axios.create({
  baseURL: 'http://192.168.68.134:8080/api/v1/',
  timeout: 3 * 60 * 1000
})
