export const getStoredAuthToken = () => localStorage.getItem('token');

export const storeAuthToken = token => localStorage.setItem('token', token);

export const removeStoredAuthToken = () => localStorage.removeItem('token');
