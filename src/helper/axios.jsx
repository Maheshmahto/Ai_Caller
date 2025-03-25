import axios from "axios";
const ApiAxios = axios.create({
    // baseURL: "http://192.168.29.82:8006/",
    baseURL: "https://api.maitriai.com/ai_assistant",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": true,
    },

  });    

  
  export default ApiAxios;
  // baseURL: "https://api.maitriai.com/maitri_assistant",
