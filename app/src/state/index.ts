import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import user from "./user/reducers";
import swap from "./swap/reducers";
import popup from "./popup/reducers";

const store = configureStore({
  reducer: {
    user,
    swap,
    popup,
  },
  middleware: [thunk],
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectUser = (state: RootState) => state.user;
export const selectSwap = (state: RootState) => state.swap;
export const selectPopup = (state: RootState) => state.popup;
