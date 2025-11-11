import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fileAPI = {
  uploadFile: async (formData) => {
    // Don't set Content-Type manually - let axios set it with the boundary
    const response = await api.post('/files/upload', formData);
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
    // Don't set Content-Type manually - let axios set it with the boundary
    const response = await api.post('/resources/upload', formData);
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
