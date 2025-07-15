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

api.interceptors.request.use(
  (config) => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`${response.status} ${response.config.url}`);
    
    if (response.data?.message) {
      console.log(`${response.data.message}`);
    }
    
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || error.message;
    
    console.error(` ${status} ${url}: ${message}`);

    switch (status) {
      case 401:
        console.log("Unauthorized - Please login again");
        break;
      case 403:
        console.log("Forbidden - Insufficient permissions");
        break;
      case 404:
        console.log(" Not Found - Resource doesn't exist");
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

export const createNote = createAsyncThunk(
  "/notes/create",
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await api.post("/note/create", noteData);
      console.log(" Note created successfully");
      return response.data.notes;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getNotes = createAsyncThunk(
  "notes/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/note/get");
      console.log("Note fetched successfully");
      return response.data.notes;

    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/update",
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/note/update/${id}`, noteData);
      console.log(" Note updated successfully");
      return response.data.note;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/note/delete/${id}`);
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
    clearNotes: (state) => {
      state.notes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create note
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
      
      // Get notes
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.notes = [];
      })
      
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Update payload:', action.payload);
        console.log('Current notes:', state.notes);
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload.id);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearNotes } = notesSlice.actions;
export default notesSlice.reducer;