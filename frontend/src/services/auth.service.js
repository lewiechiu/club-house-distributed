import httpClient from './httpClient';

const END_POINT = '/login';

const login = async (username, password) => {
  try {
    const response = await httpClient.post(END_POINT, { username, password });
    if (response?.data?.access_token) {
      localStorage.setItem('user', JSON.stringify({
        userName: username,  // TO ADD
        accessToken: response.data.access_token
      }));  
      localStorage.setItem('accessToken', response.data.access_token);
      return response.data;
    }else{
      return {'errorMsg': response?.errorMsg};
    }
  } catch (err) {
    console.log('Unexpected Error', err);
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