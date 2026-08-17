import { API_BASE } from "../config.js";
import { hideLoading, showLoading } from "../ui/loading.js";
import { showMessage } from "../ui/message.js";

const button = document.getElementById('login-btn')

async function login() {
  
  const login = document.getElementById('login-input').value;
  const password = document.getElementById('password-input').value;
  const message = document.getElementById('message');
  const success = document.getElementById('success');
  const loginBtn = document.getElementById('login-btn');

  if(!login || !password) {
    showMessage(message, 'Please fill in all fields', 2000);
    return;
  }

  showLoading(loginBtn);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({login,password})
    });

    const data = await res.json();
    
     if(res.status === 429) {
      showMessage(message, data.msg, 5000);
      return;
     }

 
    if(!res.ok) {

          if(data.errors) {
           showMessage(message, data.errors[0].msg, 5000);
          } else {
              showMessage(message, data.msg, 5000);
          }

        return;
    } else {

      showMessage(success, 'Logged in successfully!', 3000);

      if(data.role === 'user') {
          window.location.replace('/');
      } else if (data.role === 'admin') {
          window.location.replace('/');
      }
    }
  
  } catch (error) {
    console.log(error);
  } finally {
      hideLoading(loginBtn);
  }
}

const passwordWrapper = document.querySelector('.password-wrapper');
const input = document.getElementById('password-input');
const showPassword = document.querySelector('.toggle-show');
const hidePassword = document.querySelector('.toggle-hide');

hidePassword.style.display = 'none';

showPassword.addEventListener('click',() => {
  input.type = "text";
  showPassword.style.display= 'none';
  hidePassword.style.display='block';
})

hidePassword.addEventListener('click', () => {
  input.type = "password";
  showPassword.style.display = 'block';
  hidePassword.style.display = 'none';
})


button.addEventListener('click', login);

