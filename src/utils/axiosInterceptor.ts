import axios from "axios";

const axiosInterceptor = axios.create({
    baseURL:'http://localhost:8000'
})


export default axiosInterceptor