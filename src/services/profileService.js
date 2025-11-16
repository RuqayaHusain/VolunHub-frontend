const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const sendRequest = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Request failed');
  return response.json();
};


export function getProfile(userId) {
  return sendRequest(`${BASE_URL}/${userId}`);
};


export function updateProfile(userId, profileData) {
  return sendRequest(`${BASE_URL}/${userId}`, 'PUT', profileData);
};
