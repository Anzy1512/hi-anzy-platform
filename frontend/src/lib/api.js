import axios from "axios";

export const API = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : "/api";

const http = axios.create({ baseURL: API, timeout: 15000 });

export const getCaseStudies = async (params = {}) => {
  const { data } = await http.get("/case-studies", { params });
  return data;
};

export const getCaseStudy = async (slug) => {
  const { data } = await http.get(`/case-studies/${slug}`);
  return data;
};

export const getInsights = async () => {
  const { data } = await http.get("/insights");
  return data;
};

export const getInsight = async (slug) => {
  const { data } = await http.get(`/insights/${slug}`);
  return data;
};

export const getNetwork = async (params = {}) => {
  const { data } = await http.get("/network", { params });
  return data;
};

export const getNetworkCategories = async () => {
  const { data } = await http.get("/network/categories");
  return data;
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
