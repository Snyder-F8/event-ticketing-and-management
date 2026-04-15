import { createSlice } from "@reduxjs/toolkit";

// Try to restore user from localStorage
const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: parsedUser,
    token: localStorage.getItem("token"),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, setUser, logout } = authSlice.actions;
export default authSlice.reducer;