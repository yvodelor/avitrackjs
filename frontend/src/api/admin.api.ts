import axiosClient from "./axiosClient"


// profil utilisateur
export const adminApi = () => {
  return axiosClient.get("/admin")
}

