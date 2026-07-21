const host = window.location.hostname;

const isLocal =
  host === "localhost" ||
  host === "127.0.0.1" ||
  host.startsWith("192.168.") ||
  host.startsWith("10.") ||
  host.startsWith("172.");

export const API_BASE = isLocal
  ? `http://${host}:8000`
  : "https://gastoos.onrender.com";