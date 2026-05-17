import { authFetch } from "../main.js";

export async function logout() {
  try {
    const res = await authFetch('/auth/logout', {
      method: 'POST',
    });

 window.location.href = '/login.html'
  } catch (error) {
    console.log(error);
    return window.location.href = '/login.html'
  }
}


export function initLogoutBtn() {
const button = document.getElementById('logout-btn');
if(!button) return; 

button.addEventListener('click', logout)
}