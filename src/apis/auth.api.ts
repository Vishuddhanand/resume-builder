import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export const loginUser = (body: { email: string; password: string }) =>
    api.post("/auth/login", body);

export const registerUser = (body: {
    name: string;
    email: string;
    password: string;
    mobile: string;
}) => api.post("/auth/register", body);

export const logoutUser = () => api.post("/auth/logout");
