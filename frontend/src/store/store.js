import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/authSlice.js";
import commentSliceReducer from "./slices/commentSlice.js";
import dashboardSliceReducer from "./slices/dashboardSlice.js";
import likeSliceReducer from "./slices/likeSlice.js";
import playlistSliceReducer from "./slices/playlistSlice.js";
import subscriptionSliceReducer from "./slices/subscriptionSlice.js";
import userSliceReducer from "./slices/userSlice.js";
import videoSliceReducer from "./slices/videoSlice.js";
import tweetSliceReducer from "./slices/tweetSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    user: userSliceReducer,
    video: videoSliceReducer,
    subscriptions: subscriptionSliceReducer,
    comment: commentSliceReducer,
    dashboard: dashboardSliceReducer,
    like: likeSliceReducer,
    playlist: playlistSliceReducer,
    tweet: tweetSliceReducer,
  },
});

export default store;
