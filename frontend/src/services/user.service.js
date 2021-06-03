import axios from "axios";
import authHeader from "./auth-header";
import AuthService from "../services/auth.service";
const currentUser = AuthService.getCurrentUser();

const API_URL = "https://web-security-midterm.herokuapp.com/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};


const headers = {
  'Content-Type': 'application/json',
  'x-access-token': currentUser ? currentUser.accessToken : ''
}

const getAllMsg = () => {
  return axios.get(API_URL + "allMsg", {
    headers: headers
  });
};

const addMsg = (username, msg) => {
  return axios.post(API_URL + "addMsg", {
    username,
    msg
  }, {
    headers: headers
  });
};

const deleteMsg = (username, _id) => {
  return axios.post(API_URL + "deleteMsg", {
    username,
    _id
  }, {
    headers: headers
  });
};


export default {
  getPublicContent,
  getUserBoard,
  addMsg,
  deleteMsg,
  getAllMsg
};