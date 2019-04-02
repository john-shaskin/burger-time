import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-time-b9943.firebaseio.com/'
});

export default instance;