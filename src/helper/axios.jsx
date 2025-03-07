import axios from "axios";
const ApiAxios = axios.create({
    baseURL: "http://192.168.29.83:8001/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": true,
    },
  });
  
  export default ApiAxios;