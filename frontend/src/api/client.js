const API = "/api";

let accessToken = null;
let refreshToken = null;


export function initTokens() {

  const stored = localStorage.getItem("tokens");

  if (stored) {

    const tokens = JSON.parse(stored);

    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;

  }

}


export function saveTokens(tokens) {

  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;

  localStorage.setItem("tokens", JSON.stringify(tokens));

}


export function clearTokens() {

  accessToken = null;
  refreshToken = null;

  localStorage.removeItem("tokens");

}


async function refresh() {

  const res = await fetch(`${API}/auth-refresh`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({ refreshToken })

  });

  if (!res.ok) {

    clearTokens();
    window.location = "/login";
    return null;

  }

  const tokens = await res.json();

  saveTokens(tokens);

  return tokens.accessToken;

}



export async function apiFetch(url, options = {}) {

  if (!options.headers)
    options.headers = {};

  options.headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API}${url}`, options);


  if (res.status === 401) {

    const newToken = await refresh();

    if (!newToken) return res;

    options.headers.Authorization = `Bearer ${newToken}`;

    res = await fetch(`${API}${url}`, options);

  }

  return res;

}