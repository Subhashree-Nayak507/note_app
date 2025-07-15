import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
};

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, 
  headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  },
});

// using axios interceptor request modification
api.interceptors.request.use(
  (config) => {
    console.log(` ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Focus on error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    
    // Log successful responses
    if (response.data.message) {
      console.log(`${response.data.message}`);
    }
    
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || error.message;
    
    console.error(` ${status} ${url}: ${message}`);

    // Handle different error scenarios
    switch (status) {
      case 401:
        console.log("Unauthorized - Session expired");
        // Don't redirect immediately, let Redux handle it
        break;
        
      case 403:
        console.log("Forbidden - Insufficient permissions");
        break;
        
      case 404:
        console.log("Not Found - Resource doesn't exist");
        break;
        
      case 429:
        console.log("Too Many Requests - Rate limited");
        break;
        
      case 500:
        console.log("Server Error - Please try again later");
        break;
        
      default:
        if (!error.response) {
          console.log("Network Error - Check your connection");
        }
    }

    return Promise.reject(error);
  }
);

// Enhanced async thunks with better error handling
export const registerUser = createAsyncThunk(
  "/auth/signup",
  async ({ email, username, fullName, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", {
        email,
        username,
        fullName,
        password,
      });
      console.log(" Registration successful");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);
      console.log("Login successful");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
      console.log(" Logout successful");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/check-auth");
      console.log("Auth check successful");
      return response.data.user;
    } catch (error) {
      console.log("Auth check failed - User not authenticated");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;