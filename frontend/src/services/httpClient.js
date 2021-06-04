import axios from 'axios';

const httpClient = axios.create({
  baseURL: '0.0.0.0/8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const newConfig = { ...config };
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    newConfig.headers.Authorization = user.accessToken;
  } else {
    // ref: https://stackoverflow.com/questions/46362309/how-to-go-bact-to-login-page-from-axios-interceptor
    window.location.href = '/login';
  }
  return newConfig;
},
(error) => Promise.reject(error));

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('Bad Request');
          console.log(err.response.data);
          break;
        case 404:
          console.log('Not Found');
          break;
        case 500:
          console.log('Internal Server Error');
          break;
        case 503:
          console.log('Service Unavailable');
          break;
        default:
          console.log(`連接錯誤${err.response.status}`);
      }
    } else {
      console.log(err);
      console.log('連接到服務器失敗');
    }
    return Promise.resolve(err.response);
  },
);

export default httpClient;
