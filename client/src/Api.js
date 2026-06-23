import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-backend-jrwg.onrender.com/api/tasks",
});

export default API;