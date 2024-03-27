import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminType, AuthUserDataType } from "../../lib";
import type { RootState } from "../../redux";

type AuthState = {
  user: AdminType | null;
  token: string | null;
};

const slice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { admin, token },
      }: PayloadAction<{ admin: AdminType; token: string }>
    ) => {
      state.user = admin;
      state.token = token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
