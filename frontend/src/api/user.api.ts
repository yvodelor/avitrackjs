import axiosClient from "./axiosClient"
import { createCrudApi  } from "../api/crud.api";

// profil utilisateur
export const getProfileApi = () => {
  return axiosClient.get("/users/profile")
}

// update profil
export const updateProfileApi = (data: any) => {
  return axiosClient.put("/users/profile", data)
}






export type User = {
  id: string;
  name: string;
  email: string
};
export const userApi = createCrudApi<User>('/users');