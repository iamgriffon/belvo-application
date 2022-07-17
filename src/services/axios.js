import Axios from 'axios'

export const Api = Axios.create({
  baseURL: 'http://localhost:3002',
})

export const Belvo = Axios.create({
  baseURL: 'http://localhost:3000/api'
})