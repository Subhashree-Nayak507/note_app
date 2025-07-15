import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notes: [],
  isLoading: false,
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
    console.log(`📝 ${config.method?.toUpperCase()} ${config.url}`);
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
    
    console.error(`${status} ${url}: ${message}`);

    // Handle different error scenarios
    switch (status) {
      case 401:
        console.log("🔐 Unauthorized - Please login again");
        break;
        
      case 403:
        console.log("🚫 Forbidden - Insufficient permissions");
        break;
        
      case 404:
        console.log("🔍 Not Found - Note doesn't exist");
        break;
        
      case 429:
        console.log("⏰ Too Many Requests - Rate limited");
        break;
        
      case 500:
        console.log("🔥 Server Error - Please try again later");
        break;
        
      default:
        if (!error.response) {
          console.log("🌐 Network Error - Check your connection");
        }
    }

    return Promise.reject(error);
  }
);

// Enhanced async thunks with better error handling
export const createNote = createAsyncThunk(
  "/note/create",
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await api.post("/notes/create", noteData);
      console.log("📝 Note created successfully");
      return response.data.note;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getNotes = createAsyncThunk(
  "/note/get",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/notes/get?${queryParams}` : "/notes/get";
      const response = await api.get(url);
      console.log("📋 Notes fetched successfully");
      return response.data.note;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateNote = createAsyncThunk(
  "/note/update/:id",
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/notes/update/${id}`, noteData);
      console.log("✏️ Note updated successfully");
      return response.data.note;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteNote = createAsyncThunk(
  "/note/delete/:id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/notes/delete/${id}`);
      console.log(" Note deleted successfully");
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create note cases
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get notes cases
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload.notes || action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.notes = [];
      })
      
      // Update note cases
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete note cases
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.filter(note => note._id !== action.payload.id);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { 
  clearError
} = notesSlice.actions;

export default notesSlice.reducer;