import axios from "axios";

const ollama = axios.create({
  baseURL: "http://localhost:11434/api",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default ollama;
