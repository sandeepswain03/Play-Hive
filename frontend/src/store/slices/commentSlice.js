import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants.js";

const initialState = {
  loading: false,
  comments: [],
  totalComments: null,
  hasNextPage: false,
};

export const createAComment = createAsyncThunk(
  "createAComment",
  async ({ videoId, content }) => {
    try {
      console.log({ videoId, content });
      const response = await axiosInstance.post(`/comment/${videoId}`, {
        content,
      });
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const editAComment = createAsyncThunk(
  "editAComment",
  async ({ commentId, content }) => {
    try {
      const response = await axiosInstance.patch(`/comment/${commentId}`, {
        content,
      });
      toast.success(response.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const deleteAComment = createAsyncThunk(
  "deleteAComment",
  async ({ commentId }) => {
    try {
      const response = await axiosInstance.patch(`/comment/${commentId}`);
      toast.success(response.data.message);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getVideoComments = createAsyncThunk(
  "getVideoComments",
  async ({ videoId, page, limit }) => {
    const url = new URL(`${BASE_URL}/comment/${videoId}`);
    if (page) url.searchParams.set("page", page);
    if (limit) url.searchParams.set("limit", limit);

    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    cleanUpComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        state.totalComments++;
      })
      .addCase(deleteAComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        );
        state.totalComments--;
      })
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = [...state.comments, ...action.payload.docs];
        state.totalComments = action.payload.totalDocs;
        state.hasNextPage = action.payload.hasNextPage;
      });
  },
});

export const { cleanUpComments } = commentSlice.actions;
export default commentSlice.reducer;
