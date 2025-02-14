import axios, { AxiosError } from "axios";
import {
  LoginRequest,
  CreateClassroomPayload,
  UpdateClassroomPayload,
  UserPayload,
} from "../types/requests";
import { HandleError } from "../errors/handle-error-modal";
import { LoginResponse, User } from "../types/data";

axios.defaults.baseURL = "https://c0017-back2-production.up.railway.app";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        Authorization: "Bearer " + token,
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.response.status === 401) {
      if (localStorage.getItem("token")) localStorage.removeItem("token");
    }
    throw new Error(error.response.data.message);
  }
);

export const api = {
  // auth keys
  login: async ({ email, password }: LoginRequest) => {
    try {
      const response = await axios.post<LoginResponse>("/Authorization/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  // classroom keys

  getClassrooms: async () => {
    try {
      const response = await axios.get("/classroom");
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  getClassroomById: async (id: string) => {
    try {
      const response = await axios.get(`/classroom/${id}`);
      if (!response.data) {
        throw new Error("Classroom not found");
      }
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  createClassroom: async (payload: CreateClassroomPayload) => {
    try {
      const response = await axios.post("/classroom", payload);
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  updateClassroom: async (payload: UpdateClassroomPayload) => {
    try {
      const response = await axios.patch("/classroom", payload);
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  deleteClassroom: async (payload: string) => {
    try {
      const response = await axios.delete(`/classroom/${payload}`);
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  enterInClassroomWithStudent: async (classroomId: string) => {
    try {
      const response = await axios.patch("/classroom/enter-student", {
        id: classroomId,
      });
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  enterInClassroomWithTeacher: async (
    classroomId: string,
    teacherId: string
  ) => {
    try {
      const response = await axios.patch("/classroom/add-teacher", {
        id: classroomId,
        teacherId,
      });
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  // attendance keys

  createAttendanceListToClassroom: async (classroomId: string) => {
    try {
      const response = await axios.post("/attendance-list", {
        classroomId,
      });
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  myAttendances: async () => {
    try {
      const response = await axios.get("/attendance-list/me");
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  getAttendanceLists: async () => {
    try {
      const response = await axios.get("/attendance-list");
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  registerOnAttendance: async (attendanceId: string) => {
    try {
      const response = await axios.post(
        "/attendance-list/registerInAttendanceList",
        {
          attendanceListId: attendanceId,
        }
      );
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },

  // user keys
  createUser: async (payload: UserPayload) => {
    try {
      const response = await axios.post("/user", payload);
      return response.data;
    } catch (err: any) {
      HandleError({ message: err.message });
    }
  },
};
