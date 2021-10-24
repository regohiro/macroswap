import { createAction } from "@reduxjs/toolkit";

export interface IAlert {
  active: boolean;
  title: string;
  message: string;
}

export interface ISuccess {
  active: boolean;
  txHash: string;
  message: string;
}

export const setAlertModal = createAction<IAlert>("popup/setAlertModal");
export const setSuccessModal = createAction<ISuccess>("popup/setSuccessModal");
