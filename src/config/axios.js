import axios from "axios";
import { API_BASE_URL } from "@env";
import { resetState as logout } from "@reducers/user";
import { navigate } from "./rootNavigation";
// import showGlobalModal from '@Components/GlobalModal';

console.log(API_BASE_URL)

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
});

export const setupAxiosInterceptors = (store) => {
    const dispatch = store.dispatch;
    const onRequestSuccess = config => {
        const { token } = store.getState().user;
        console.log("request success", config);
        if (token) {
            console.log(token);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    };
    const onRequestFail = error => {
        console.log("request error", error);
        return Promise.reject(error);
    };
    apiClient.interceptors.request.use(onRequestSuccess, onRequestFail);

    const onResponseSuccess = response => {
        console.log("response success", response);
        return response;
    };
    const onResponseFail = error => {
        const message = error.response?.data?.message || error.message;
        console.log('message', message);
        // showGlobalModal({
        // })
        if (message === 'jwt expired') {
            console.log('jwt expired');
            dispatch(logout());
            navigate('SignIn');
        }
        return Promise.reject(error);
    };
    apiClient.interceptors.response.use(onResponseSuccess, onResponseFail);
};