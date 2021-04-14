import Axios from 'axios/index'


export const requests = Axios.create({
  baseURL: 'http://aocpo.coderchen01.top:9999/api/v1/',
  timeout: 3 * 60 * 1000
})
