import httpClient from './httpClient';

const END_POINT = '/login';

const login = (username, password) => {
  try {
    const response = await httpClient.post(END_POINT, { username, password });
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify({
        userName: username,  // TO ADD
        accessToken: response.data.access_token
      }));  
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  login,
  logout,
  getCurrentUser,
};