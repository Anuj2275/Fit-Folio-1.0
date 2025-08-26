import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => { 
    const token = localStorage.getItem('token');
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const auth = {
  signup:(userdata) => api.post('/auth/signup', userdata),
  login:(credentials) => api.post('/auth/login', credentials), 
};

const tasks = {
  getTasks: ()=> api.get("/items"),
  createTask: (data) => api.post("/items", data),
  updateTask: (id, data) => api.put(`/items/${id}`, data),
  deleteTask: (id) => api.delete(`/items/${id}`),
  getTaskById: (id) => api.get(`/items/${id}`),
};

const files = {
  uploadProfilePicture: (formData) => {
    return api.post("/upload/profile", formData, {
      headers:{
        'Content-Type':'multipart/form-data'
      }
    });
  }
};

const shortener = {
  createShortUrl:(longUrl) => api.post('/shorten',{longUrl})
}

const notes = {
  getNotes:()=> api.get("/notes"),
  createNote:(noteData)=> api.post("/notes",noteData),
  getNoteById:(id)=> api.get(`/notes${id}`),
  updateNote:(id,noteData)=> api.put(`/notes/${id}`,noteData),
  deleteNote:(id)=> api.get(`/notes/${id}`),
}

export default {
  auth,
  tasks,
  files,
  shortener,
  notes
};
