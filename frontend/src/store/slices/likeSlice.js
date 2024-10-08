import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  likedVideos: [],
};

export const toggleVideoLike = createAsyncThunk(
  "toggleVideoLike",
  async (videoId) => {
    try {
      const response = await axiosInstance.post(`/like/toggle/video/${videoId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "toggleVideoLike",
  async (tweetId) => {
    try {
      const response = await axiosInstance.post(`/like/toggle/tweet/${tweetId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "toggleVideoLike",
  async (commentId) => {
    try {
      const response = await axiosInstance.post(`/like/toggle/comment/${commentId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);
export const getLikedVideos = createAsyncThunk("getLikedVideos", async () => {
  try {
    const response = await axiosInstance.get("like/videos");
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.likedVideos = action.payload;
      });
  },
});

export default likeSlice.reducer;
