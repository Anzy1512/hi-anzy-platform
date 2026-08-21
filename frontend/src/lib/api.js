import axios from "axios";

export const API = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : "/api";

const http = axios.create({ baseURL: API, timeout: 15000 });

// Backend contract: GET /case-studies?featured=<bool> -> array
export const getCaseStudies = async (params = {}) => {
  const query = typeof params === "boolean" ? { featured: params } : params || {};
  const { data } = await http.get("/case-studies", { params: query });
  return Array.isArray(data) ? data : [];
};

export const getCaseStudy = async (slug) => {
  const { data } = await http.get(`/case-studies/${slug}`);
  return data;
};

// Backend contract: GET /insights -> array (no server-side category filter),
// so the category chips on /insights are applied client-side.
export const getInsights = async (category = null) => {
  const { data } = await http.get("/insights");
  const list = Array.isArray(data) ? data : [];
  return category ? list.filter((p) => p.category === category) : list;
};

export const getInsight = async (slug) => {
  const { data } = await http.get(`/insights/${slug}`);
  return data;
};

// Backend contract: GET /network?category=<str> -> array
export const getNetwork = async (params = {}) => {
  const query = typeof params === "string" ? { category: params } : params || {};
  const { data } = await http.get("/network", { params: query });
  return Array.isArray(data) ? data : [];
};

// Backend contract: GET /network/categories -> { categories: [...] }
// Unwrapped here so callers always receive a plain array.
export const getNetworkCategories = async () => {
  const { data } = await http.get("/network/categories");
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.categories) ? data.categories : [];
};

export const submitContact = async (payload) => {
  const { data } = await http.post("/contact", payload);
  return data;
};

export const track = async (name, meta = {}, path = window.location.pathname) => {
  try {
    await http.post("/analytics/event", { name, meta, path });
  } catch {
    // fire-and-forget — never throw
  }
};
