import Axios from 'axios/index'


export const requests = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3 * 60 * 1000
})
