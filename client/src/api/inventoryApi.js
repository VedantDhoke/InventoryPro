import api from './axios';

export const getTransactions = (params) => api.get('/inventory/transactions', { params });
export const adjustInventory = (data) => api.post('/inventory/adjust', data);
