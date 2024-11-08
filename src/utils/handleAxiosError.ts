// src/utils/handleAxiosError.ts
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail: string }>;

    // Check the response status
    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;
      switch (status) {
        case 400:
          toast.error(data.detail || 'Invalid request.');
          break;
        case 401:
          toast.error(data.detail || 'Unauthorized access.');
          break;
        case 404:
          toast.error(data.detail || 'Resource not found.');
          break;
        case 500:
          toast.error(data.detail || 'Server error.');
          break;
        default:
          toast.error(data.detail || 'An unknown error occurred.');
      }
    } else if (axiosError.request) {
      // The request was made but no response was received
      toast.error('No response from the server.');
    } else {
      // An error occurred while setting up the request
      toast.error(axiosError.message);
    }

    throw error; // Re-throw the error after handling
  } else {
    // Other types of errors
    toast.error('An unexpected error occurred.');
    throw new Error('Different error than Axios');
  }
};
