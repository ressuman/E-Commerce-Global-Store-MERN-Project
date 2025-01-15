import { createSlice } from "@reduxjs/toolkit";

const initialState = (() => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    const expirationTime = localStorage.getItem("expirationTime");
    const isExpired = expirationTime && new Date().getTime() > expirationTime;

    if (userInfo && !isExpired) {
      return { userInfo: JSON.parse(userInfo) };
    } else {
      localStorage.clear(); // Clear expired data
      return { userInfo: null };
    }
  } catch (error) {
    console.error("Error loading user info from localStorage:", error);
    return { userInfo: null };
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      try {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));

        const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem("expirationTime", expirationTime);
      } catch (error) {
        console.error("Error saving user info to localStorage:", error);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
