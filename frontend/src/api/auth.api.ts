import axiosClient from "./axiosClient"

// REGISTER
export const registerApi = (data: any) => {
  return axiosClient.post("/auth/register", data)
}

// LOGIN
export const loginApi = (data: any) => {
  return axiosClient.post("/auth/login", data)
}