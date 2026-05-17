import { authFetch } from "../main.js";

export async function getUser() {
  try {
    const res = await authFetch ('/users/', {
      method: 'GET',
    })

    const data = await res.json();

    if(!res.ok) {
      return null
    } else {
      return data;
    }

  } catch (error) {
    console.error(error);
    return null;
  }
}

export let user = 'Tracker';

export async function loadUser() {
  const data = await getUser();
  user = data?.user?.username || 'Tracker'; 
  console.log(user);
 
  return user;
}

