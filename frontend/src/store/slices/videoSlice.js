import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import { BASE_URL } from "../../constants.js";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  uploading: false,
  uploaded: false,
  videos: {
    docs: [],
    hasNextPage: false,
  },
  video: null,
  publishToggled: false,
};

export const getAllVideos = createAsyncThunk(
  "getAllVideos",
  async ({ userId, sortBy, sortType, query, page, limit }) => {
    try {
      const url = new URL(`${BASE_URL}/video`);
      if (userId) url.searchParams.set("userId", userId);
      if (query) url.searchParams.set("query", query);
      if (page) url.searchParams.set("page", page);
      if (limit) url.searchParams.set("limit", limit);
      if (sortBy && sortType) {
        url.searchParams.set("sortBy", sortBy);
        url.searchParams.set("sortType", sortType);
      }

      const response = await axiosInstance.get(url);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const publishAVideo = createAsyncThunk("publishAVideo", async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("thumbnail", data.thumbnail[0]);
  formData.append("videoFile", data.videoFile[0]);

  try {
    const response = await axiosInstance.post("/video", formData);
    toast.success(response.data?.message);
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

export const updateAVideo = createAsyncThunk("updateAVideo", async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("thumbnail", data.thumbnail[0]);

  try {
    const respoonse = await axiosInstance.patch(
      `/video/${data.videoId}`,
      formData
    );
    toast.success(respoonse.data?.message);
    return respoonse.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

export const deleteAVideo = createAsyncThunk(
  "deleteAVideo",
  async (videoId) => {
    try {
      const response = await axiosInstance.delete(`/video/${videoId}`);
      toast.success(response.data?.message);
      return videoId;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getVideoById = createAsyncThunk(
  "getVideoById",
  async ({ videoId }) => {
    try {
      const response = await axiosInstance.get(`/video/${videoId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  "togglePublishStatus",
  async (videoId) => {
    try {
      const response = await axiosInstance.patch(
        `/video/toggle/publish/${videoId}`
      );
      toast.success(response.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    updateUploadState: (state) => {
      state.uploading = false;
      state.uploaded = false;
    },
    makeVideosNull: (state) => {
      state.videos.docs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.docs = [...state.videos.docs, ...action.payload.docs];
        state.videos.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(publishAVideo.pending, (state) => {
        state.uploading = true;
      })
      .addCase(publishAVideo.fulfilled, (state) => {
        state.uploading = false;
        state.uploaded = true;
      })
      .addCase(updateAVideo.pending, (state) => {
        state.uploading = true;
      })
      .addCase(updateAVideo.fulfilled, (state) => {
        state.uploading = false;
        state.uploaded = true;
      })
      .addCase(deleteAVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAVideo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
      })
      .addCase(togglePublishStatus.fulfilled, (state) => {
        state.publishToggled = !state.publishToggled;
      });
  },
});

export const { updateUploadState, makeVideosNull } = videoSlice.actions;
export default videoSlice.reducer;