import axios from "axios";
import axiosInterceptor from "../../utils/axiosInterceptor";

export const apiLogin = (data:API.UserLogin ) => {

  // need write full url because this axios not have baseURL like axiosInterceptor
  return axios.post<API.UserLoginResponse>('http://localhost:8000/dj-rest-auth/login/', data);
  return axios.post<API.UserLoginResponse>('/dj-rest-auth/login/', data);
};

export const apiGetMe = () => {
    return axiosInterceptor.get<API.User>('/dj-rest-auth/user/')
}