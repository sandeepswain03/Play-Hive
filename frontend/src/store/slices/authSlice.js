import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  status: false,
  loading: false,
  userData: null,
};

export const createAccount = createAsyncThunk("register", async (data) => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("avatar", data.avatar[0]);
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage[0]);
  }
  try {
    const response = await axiosInstance.post("/users/register", formData);
    console.log(response.data);
    toast.success("Registered successfully!");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const userLogin = createAsyncThunk("login", async (data) => {
  try {
    const response = await axiosInstance.post("/users/login", data);
    return response.data.data.user;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

export const userLogout = createAsyncThunk("logout", async () => {
  try {
    const response = await axiosInstance.post("/users/logout");
    toast.success(response.data?.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

export const refreshAccessToken = createAsyncThunk(
  "refreshAccessToken",
  async (data) => {
    try {
      const response = await axiosInstance.post("/users/refresh-token", data);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const changePassword = createAsyncThunk(
  "changePassword",
  async (data) => {
    try {
      const response = await axiosInstance.post("/users/change-password", data);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getCurrentUser = createAsyncThunk("getCurrentUser", async () => {
  const response = await axiosInstance.get("/users/current-user");
  return response.data.data;
});

export const updateAvatar = createAsyncThunk("updateAvatar", async (avatar) => {
  try {
    const response = await axiosInstance.patch("/users/update-avatar", avatar);
    toast.success("Updated details successfully!");
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const updateCoverImg = createAsyncThunk(
  "updateCoverImg",
  async (coverImage) => {
    try {
      const response = await axiosInstance.patch(
        "/users/update-coverImg",
        coverImage
      );
      toast.success(response.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "updateUserDetails",
  async (data) => {
    try {
      const response = await axiosInstance.patch("/users/update-user", data);
      toast.success("Updated details successfully!");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      })
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(updateCoverImg.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoverImg.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      });
  },
});

export default authSlice.reducer;
