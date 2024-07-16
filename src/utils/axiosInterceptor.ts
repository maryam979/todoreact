import axios, { isAxiosError } from "axios";

const axiosInterceptor = axios.create({
    baseURL:'http://127.0.0.1:8000/'
})

axiosInterceptor.interceptors.request.use(
    async (config) => {
        // Do something before request is sent
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            console.log("Access token found, adding to request headers");
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    },
);

axiosInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    (error)=>{
        if(isAxiosError(error)){
            const originalRequest = error.config;
            if (
                error.response?.status === 401 &&
                originalRequest?.url === '/dj-rest-auth/token/refresh/'
            ) {
                return Promise.reject(error);
            }

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken && originalRequest) {
                const data = {
                    refresh: refreshToken,
                };
                
                if (error.response?.status === 401 && !originalRequest?._retry) {
                    originalRequest._retry = true;
                    return axiosInterceptor
                        .post('/dj-rest-auth/token/refresh/', data)
                        .then(async (res) => {
                            console.log('originalRequest.url :', originalRequest.url);
                            // 1) Save the new access token.
                            await localStorage.setItem('access_token', res.data.access);
                            await localStorage.setItem('refresh_token', res.data.refresh);
                            // 2) Change Authorization header
                            const newConfig = {
                                ...error.response?.config,
                                headers:{
                                    ...error.response?.config.headers,
                                    Authorization: 'Bearer ' + res.data.access
                                }
                            }
                            // 3) return originalRequest object with Axios.
                            return axiosInterceptor(newConfig);
                        })
                        .catch(async (error) => {
                            // Destroy all tokens.
                            if (error.response?.status === 401) {
                                localStorage.removeItem('refresh_token');
                                localStorage.removeItem('access_token');
                            }
                            // return Error object with Promise
                            return Promise.reject(error);
                        });
                }
            }
        }
        return Promise.reject(error);
    }
)




export default axiosInterceptor