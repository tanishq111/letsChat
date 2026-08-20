import axios from 'axios';

export const api = axios.create({
     baseURL:"http://localhost:3000",
     headers: {
         "Content-type" : "application/json"
     }
    
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // localstorage lies in the browser -> node code cannot access this
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // handle unauthorized errors, e.g., redirect to login
            localStorage.removeItem("token");
            window.location.href = "/login"; // we can use navigate here but we are not in a react component so we cannot use it here. So we will use window.location.href to redirect to login page
        }
        return Promise.reject(error);
    }
);


export default api;

