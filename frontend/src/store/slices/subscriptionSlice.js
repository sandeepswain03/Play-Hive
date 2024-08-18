import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  subscribed: null,
  channelSubscribers: [],
  mySubscriptions: [],
};

export const toggleSubscription = createAsyncThunk(
  "toggleSubscription",
  async (channelId) => {
    try {
      const response = await axiosInstance.post(`subscription/channel/${channelId}`);
      return response.data.data.subscribed;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getUserChannelSubscribers = createAsyncThunk(
  "getUserChannelSubscribers",
  async (channelId) => {
    try {
      const response = await axiosInstance.get(`subscription/channel/${channelId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getSubcribedChannels = createAsyncThunk(
  "getSubcribedChannels",
  async (subscriberId) => {
    try {
      const response = await axiosInstance.get(
        `subscription/user/${subscriberId}`
      );
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return error;
    }
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribed = action.payload;
      })
      .addCase(getUserChannelSubscribers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.channelSubscribers = action.payload;
      })
      .addCase(getSubcribedChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubcribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubscriptions = action.payload.filter(
          (sub) => sub?.subscribedChannel?.latestVideo
        );
      });
  },
});

export default subscriptionsSlice.reducer;
