import axios from 'axios';

const apiBaseUrl =
  import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const auth = {
  signup: (userdata) => api.post('/api/auth/signup', userdata),
  login: (credentials) => api.post('/api/auth/login', credentials),
};
const tasks = {
  getTasks: () => api.get("/api/items"),
  createTask: (data) => api.post("/api/items", data),
  updateTask: (id, data) => api.put(`/api/items/${id}`, data),
  deleteTask: (id) => api.delete(`/api/items/${id}`),
  getTaskById: (id) => api.get(`/api/items/${id}`),
};

const files = {
  uploadProfilePicture: (formData) => {
    return api.post("/api/files/upload-profile-picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

const shortener = {
  createShortUrl: (longUrl) => api.post('/api/shorten', { longUrl })
}

const notes = {
  getNotes: () => api.get("/api/notes"),
  createNote: (noteData) => api.post("/api/notes", noteData),
  getNoteById: (id) => api.get(`/api/notes/${id}`),
  updateNote: (id, noteData) => api.put(`/api/notes/${id}`, noteData),
  deleteNote: (id) => api.delete(`/api/notes/${id}`),
}
export default {
  auth,
  tasks,
  files,
  shortener,
  notes
};