
import axios from "axios";
import { getCookie } from "cookies-next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const appAxios = axios.create({
    baseURL: apiUrl + "api",
});

appAxios.interceptors.request.use((conf) => {
    const token = getCookie("token");
    if (token) {
        conf.headers = {
            ...conf.headers,
            Authorization: `Bearer ${token}`,
        } as any;
    }
    return conf;
});

appAxios.interceptors.response.use(
    (resp) => {
        return resp;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export { appAxios };
