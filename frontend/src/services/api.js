/**
 * API Service
 * All backend API calls
 */

const BASE_URL = process.env.REACT_APP_API_URL || '';

// Get token from localStorage
const getToken = () => localStorage.getItem('codesense_token');

// Helper
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

// Auth headers
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── Auth ───────────────────────────────────────────────────────────────────
export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

// ── OTP ────────────────────────────────────────────────────────────────────
export const sendOTP = async (email) => {
  const res = await fetch(`${BASE_URL}/api/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
};

export const verifyOTP = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/api/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse(res);
};

// ── Review ─────────────────────────────────────────────────────────────────
export const reviewCode = async (code) => {
  const res = await fetch(`${BASE_URL}/api/review`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ code }),
  });
  return handleResponse(res);
};

export const reviewFile = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/review/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return handleResponse(res);
};

// ── History ────────────────────────────────────────────────────────────────
export const getHistory = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/api/history?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const getReviewById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/history/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const deleteReview = async (id) => {
  const res = await fetch(`${BASE_URL}/api/history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const clearHistory = async () => {
  const res = await fetch(`${BASE_URL}/api/history`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
};

// ── Share ──────────────────────────────────────────────────────────────────
export const generateShareLink = async (reviewId) => {
  const res = await fetch(`${BASE_URL}/api/share/${reviewId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const getSharedReview = async (shareId) => {
  const res = await fetch(`${BASE_URL}/api/share/${shareId}`);
  return handleResponse(res);
};

// ── Compare ────────────────────────────────────────────────────────────────
export const comparePasted = async (code1, code2, name1, name2) => {
  const res = await fetch(`${BASE_URL}/api/compare`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ code1, code2, name1, name2 }),
  });
  return handleResponse(res);
};

export const compareFiles = async (file1, file2) => {
  const form = new FormData();
  form.append('files', file1);
  form.append('files', file2);
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/compare`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return handleResponse(res);
};
