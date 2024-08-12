import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  playlist: [],
  playlists: [],
};

export const createAPLaylist = createAsyncThunk(
  "createAPLaylist",
  async ({ name, description }) => {
    try {
      const response = await axiosInstance.post("/playlist", {
        name,
        description,
      });
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "addAVideoToPlaylist",
  async (playlistId) => {
    try {
      const response = await axiosInstance.patch(`/playlist/add/${playlistId}`);
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "removeVideoFromPlaylist",
  async (playlistId) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/remove/${playlistId}`
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  "getPlaylistById",
  async (playlistId) => {
    try {
      const response = await axiosInstance.get(`/playlist/${playlistId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getPlaylistByUser = createAsyncThunk(
  "getPlaylistByUser",
  async (userId) => {
    try {
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "updatePlaylist",
  async ({ playlistId, name, description }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/${playlistId}`, {
        name,
        description,
      });
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createAPLaylist.pending, (state) => {
      state.loading = true;
    });
  },
});

export default playlistSlice.reducer;
