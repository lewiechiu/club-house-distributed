import axios from 'axios';

const httpClient = axios.create({
  baseURL: '1.0.0.0/8080',
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
      var errMsg = ''
      switch (err.response.status) {
        case 400:
          errMsg = '400 Bad Request';
          console.log(err.response.data);
          break;
        case 404:
          errMsg = '404 Not Found';
          break;
        case 500:
          errMsg = '500 Internal Server Error';
          break;
        case 503:
          errMsg = '503 Service Unavailable';
          break;
        default:
          errMsg = `連接錯誤${err.response.status}`;
      }
      console.log(errMsg)
      return {'errorMsg': errMsg}
    } else {
      console.log(err);
      return {'errorMsg': '連接到服務器失敗'}
    }
    return Promise.resolve(err.response);
  },
);

export default httpClient;
