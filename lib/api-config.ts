const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL environment variable is not set");
}

export { API_BASE_URL };
