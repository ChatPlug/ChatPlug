import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:2137/api/v1',
})
