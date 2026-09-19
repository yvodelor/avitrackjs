// src/api/createCrudApi.ts
import type { AxiosInstance } from "axios";
import axiosClient from "./axiosClient";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type CrudApi<T extends { id: string | number }> = {
  getAll: () => Promise<T[]>;
  getById: (id: T["id"]) => Promise<T | null>;
  getByField: (
    field: string,
    value: string | number
  ) => Promise<T[]>;
  create: (data: Omit<T, "id"> | FormData) => Promise<T>;
  update: (
    id: T["id"],
    data: Partial<Omit<T, "id">> | FormData
  ) => Promise<T>;
  delete: (id: T["id"]) => Promise<boolean>;
};

export const createCrudApi = <T extends { id: string | number }>(
  baseUrl: string,
  client: AxiosInstance = axiosClient
): CrudApi<T> => {
  return {
    getAll: async (): Promise<T[]> => {
      const res = await client.get<ApiResponse<T[]>>(baseUrl);

      return res.data.data;
    },

    getById: async (id): Promise<T | null> => {
      try {
        const res = await client.get<ApiResponse<T>>(
          `${baseUrl}/${id}`
        );

        return res.data.data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    // ======================================================
    // GET BY FIELD
    // ======================================================

    getByField: async (
      field,
      value
    ): Promise<T[]> => {
      const res =
        await client.get<ApiResponse<T[]>>(
          `${baseUrl}/by`,
          {
            params: {
              field,
              value,
            },
          }
        );

      return res.data.data;
    },

    create: async (data): Promise<T> => {
      const res = await client.post<ApiResponse<T>>(
        baseUrl,
        data,
        data instanceof FormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined
      );

      return res.data.data;
    },

    update: async (id, data): Promise<T> => {
      const res = await client.put<ApiResponse<T>>(
        `${baseUrl}/${id}`,
        data,
        data instanceof FormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined
      );

      return res.data.data;
    },

    delete: async (id): Promise<boolean> => {
      const res = await client.delete<ApiResponse<unknown>>(
        `${baseUrl}/${id}`
      );

      return res.data.success;
    },
  };
};