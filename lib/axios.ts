import axios from 'axios';

let moduleAccessToken: string | null = null;

export const setModuleAccessToken = (token: string | null) => {
    moduleAccessToken = token;
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (moduleAccessToken) {
            config.headers.Authorization = `Bearer ${moduleAccessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshBase = process.env.NEXT_PUBLIC_BACKEND_URL;
                // 
                const response = await axios.post(
                    `${refreshBase}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (response.data.status === 'success') {
                    const { accessToken } = response.data.data;

                    setModuleAccessToken(accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, just reject. 
                // Don't force redirect or clear localStorage here; let the AuthProvider manage that.
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
