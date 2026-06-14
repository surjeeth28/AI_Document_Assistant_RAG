import config from "./config";

// 🔐 Get token helper
const getToken = () => localStorage.getItem("token");

export const api = {
  // ✅ Signup
  signup: async (email, password) => {
    const res = await fetch(`${config.BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return res.json();
  },

  // ✅ Login
  login: async (email, password) => {
    const res = await fetch(`${config.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return res.json();
  },

  // 💬 Chat
  chat: async (query) => {
    const res = await fetch(
      `${config.BASE_URL}/chat?query=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return res.json();
  },

  // 📄 Upload
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${config.BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    return res.json();
  },

  history: async () => {
  const res = await fetch(`${config.BASE_URL}/history`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
},

};