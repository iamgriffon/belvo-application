import Axios from 'axios';

const credentials = btoa(`${process.env.BELVO_SANDBOX_SECRET_ID}:${process.env.BELVO_SANDBOX_SECRET_PASSWORD}`)

export const BelvoDirect = Axios.create({
  baseURL: 'https://sandbox.belvo.com',
  headers: {
    'Authorization': `Basic ${credentials}`
  }
})