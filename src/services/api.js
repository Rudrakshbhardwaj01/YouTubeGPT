import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const processVideo = async (videoUrl) => {
  try {
    const response = await api.post('/process-video', { video_url: videoUrl });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to process video');
  }
};

export const askQuestion = async (question) => {
  try {
    const response = await api.post('/ask-question', { question });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get answer');
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get history');
  }
};

export const getTranscript = async () => {
  try {
    const response = await api.get('/transcript');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get transcript');
  }
};

export const clearHistory = async () => {
  try {
    const response = await api.post('/clear-history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to clear history');
  }
};
