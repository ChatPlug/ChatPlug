import axios from 'axios'

export default axios.create({
  baseURL: 'localhost:2137/api/v1',
})
