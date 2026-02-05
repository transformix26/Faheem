import axios from 'axios';

let moduleAccessToken: string | null = null;

export const setModuleAccessToken = (token: string | null) => {
    moduleAccessToken = token;
};

const api = axios.create({
    baseURL: typeof window !== 'undefined' ? '/api/proxy' : process.env.NEXT_PUBLIC_BACKEND_URL,
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
                const refreshBase = typeof window !== 'undefined' ? '/api/proxy' : process.env.NEXT_PUBLIC_BACKEND_URL;
                // 
                const response = await axios.get(
                    `${refreshBase}/api/auth/refresh`,
                    { withCredentials: true }
                );

                if (response.data.status === 'success') {
                    const { accessToken } = response.data.data;

                    setModuleAccessToken(accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError: any) {
                // If the REFRESH itself fails with 401/403, it means the session is DEAD.
                // We dispatch a custom event so the AuthProvider can catch it and do a clean logout.

                await api.get("/api/auth/logout", { withCredentials: true });

                if (typeof window !== 'undefined' && (refreshError.response?.status === 401 || refreshError.response?.status === 403)) {
                    window.dispatchEvent(new CustomEvent('faheem:unauthorized'));
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
