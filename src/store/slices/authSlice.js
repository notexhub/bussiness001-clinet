import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const adminLogin = createAsyncThunk(
  "auth/admin_login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/admin_login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const adminLogout = createAsyncThunk("auth/admin_logout", async () => {
  await api.post("/auth/admin_logout");
});

export const adminCheckAuth = createAsyncThunk(
  "auth/admin_me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/admin_me");
      return response.data;
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);


export const adminSignup = createAsyncThunk(
  "/admin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);






export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        if (action.payload?.token) {
           localStorage.setItem("notex_token", action.payload.token);
        }
      })

      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(adminCheckAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminCheckAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(adminCheckAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        if (action.payload.token) {
          localStorage.setItem("notex_token", action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.user = action.payload.admin;
        state.loading = false;
        if (action.payload.token) {
           localStorage.setItem("notex_token", action.payload.token);
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        if (action.payload.token) {
          localStorage.setItem("notex_token", action.payload.token);
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("notex_token");
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("notex_token");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
