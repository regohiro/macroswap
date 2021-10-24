import { createReducer } from "@reduxjs/toolkit";
import { IAlert, ISuccess, setAlertModal, setSuccessModal } from "./actions";

interface IState {
  alert: IAlert;
  success: ISuccess;
}

const initialState: IState = {
  alert: {
    active: false,
    title: "",
    message: "",
  },
  success: {
    active: false,
    txHash: "",
    message: "",
  },
};

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(setAlertModal, (state, { payload: alert }) => {
      return {
        ...state,
        alert,
      };
    })
    .addCase(setSuccessModal, (state, { payload: success }) => {
      return {
        ...state,
        success,
      };
    });
});
