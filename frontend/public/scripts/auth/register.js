import { API_BASE } from "../config.js";
import { hideLoading, showLoading } from "../ui/loading.js";

const button = document.getElementById('register-btn');


async function registerUser() {
const firstName = document.getElementById('firstname-input').value;
const lastName = document.getElementById('lastname-input').value
const username = document.getElementById('username-input').value
const email = document.getElementById('email-input').value;
const password = document.getElementById('password-input').value
const confirmPassword = document.getElementById('confirm-password-input').value;
const registerBtn = document.getElementById('register-btn');


const message = document.getElementById('message');
const success = document.getElementById('success');

message.style.display = 'none';
message.innerText = '';
success.style.display = 'none';
success.innerText = '';


if(!firstName || !lastName || !username || !email || !password || !confirmPassword) {
  message.style.display = 'block';
  message.innerText = 'Please fill in all fields';
  
  setTimeout(() => {
      message.style.display = 'none';
      message.innerText = '';
    },2000)
    
  return;
}

showLoading(registerBtn);

try {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({firstName,lastName,username,email,password,confirmPassword})
  });
  
  const data = await res.json();

  if(!res.ok){
    message.style.display = 'block';
    if(data.errors) {
    message.innerText = data.errors.map(err => err.msg).join(', ');
    hideLoading(registerBtn);
    } else {
      message.innerText = data.msg;
    }
  setTimeout(() => {
      message.style.display = 'none';
      message.innerText = '';
    },2000)
    
  } else {
    localStorage.setItem("email", email);
    localStorage.setItem("resendCooldown", Date.now() + 30 * 1000);

    window.location.replace("/verify");
    setTimeout(() => {
      success.style.display = 'none';
    },2000)
  }} catch (error) {
  hideLoading(registerBtn);
  console.log(error);
}
}

const passwordWrappers = document.querySelectorAll('.password-wrapper');


passwordWrappers.forEach(wrapper => {
const hidePassword = wrapper.querySelector('.toggle-hide');
const showPassword = wrapper.querySelector('.toggle-show');
const input = wrapper.querySelector('.password-input');

hidePassword.style.display = 'none';

showPassword.addEventListener('click', () => {
    input.type = "text";
    showPassword.style.display = 'none';
    hidePassword.style.display = 'block';
});

hidePassword.addEventListener('click', () => {
    input.type = "password";
    hidePassword.style.display = 'none';
    showPassword.style.display = 'block';
});
 

})


button.addEventListener('click', registerUser);