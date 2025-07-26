import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // adjust for deployment
});

export const summarizeTranscript = async (transcript) => {
  try {
    const response = await API.post('/api/summarize', { transcript });
    return response.data;
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    throw error;
  }
};
