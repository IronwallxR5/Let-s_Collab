const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper function to make fetch requests with auth
const fetchWithAuth = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  // Parse response
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `HTTP error! status: ${response.status}`
    );
  }

  return data;
};

export default fetchWithAuth;
