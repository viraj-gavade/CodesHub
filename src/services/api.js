import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fileAPI = {
  uploadFile: async (formData) => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFiles: async (filters = {}) => {
    const response = await api.get('/files', { params: filters });
    return response.data;
  },

  getFileContent: async (id) => {
    const response = await api.get(`/files/${id}/content`);
    return response.data;
  },

  downloadFile: async (id, fileName) => {
    const response = await api.get(`/files/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  deleteFile: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },
};

export const resourceAPI = {
  uploadResource: async (formData) => {
    const response = await api.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getResources: async (filters = {}) => {
    const response = await api.get('/resources', { params: filters });
    return response.data;
  },

  downloadResource: async (id, fileName) => {
    const response = await api.get(`/resources/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },
};

export default api;
