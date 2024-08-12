import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  tweets: [],
};

export const createTweet = createAsyncThunk(
  "createTweet",
  async ({ content }) => {
    try {
      const response = await axiosInstance.post("/tweet", content);
      toast.success(response.data?.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const editTweet = createAsyncThunk(
  "editTweet",
  async ({ tweetId, content }) => {
    try {
      const response = await axiosInstance.patch(`/tweet/${tweetId}`, content);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "deleteTweet",
  async ({ tweetId }) => {
    try {
      const response = await axiosInstance.delete(`/tweet/${tweetId}`);
      toast.success(response.data.message);
      return response.data.data.tweetId;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getUserTweets = createAsyncThunk(
  "getUserTweets",
  async (userId) => {
    try {
      const response = await axiosInstance.get(`/tweet/user/${userId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTweet.fulfilled, (state, action) => {
        state.tweets.unshift(action.payload);
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(
          (tweet) => tweet._id !== action.payload
        );
      })
      .addCase(getUserTweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
      });
  },
});

export default tweetSlice.reducer;
