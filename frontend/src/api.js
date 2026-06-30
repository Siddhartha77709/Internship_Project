// Central API base URL
// In production (Netlify), set VITE_API_URL to your backend URL e.g. https://shopez-api.onrender.com
// In development, the Vite proxy forwards /api → localhost:5000 automatically
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
