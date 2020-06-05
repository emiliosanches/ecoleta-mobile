import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ecoletabackend.herokuapp.com'
})

export default api;