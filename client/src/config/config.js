// API Base URL 
const BASE_URL = import.meta.env.VITE_BASE_URL;


// API Routes config
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    SIGNUP: `${BASE_URL}/api/auth/signup`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    VERIFY: `${BASE_URL}/api/auth/verify`
  },
  ENTRIES: `${BASE_URL}/api/entries`,
  ENTRY: (id) => `${BASE_URL}/api/entries/${id}`,
  MOOD: `${BASE_URL}/api/mood`,
  CHATBOT: `${BASE_URL}/api/bot/question`,
  WORDCLOUD: `${BASE_URL}/api/wordcloud`,
  MAP: {
    GEOCODE: `${BASE_URL}/api/map/geocode`,
    SUMMARY: `${BASE_URL}/api/map/location-summary`
  },
  TIMETRAVEL: `${BASE_URL}/api/timetravel`
};

