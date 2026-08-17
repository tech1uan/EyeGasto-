import { API_BASE } from "../config.js";
import { hideLoading, showLoading } from "../ui/loading.js";
import { showMessage } from "../ui/message.js";

const button = document.getElementById('register-btn');


async function registerUser() {
const firstName = document.getElementById('firstname-input').value;
const lastName = document.getElementById('lastname-input').value
const username = document.getElementById('username-input').value
const password = document.getElementById('password-input').value
const confirmPassword = document.getElementById('confirm-password-input').value;
const registerBtn = document.getElementById('register-btn');


const message = document.getElementById('message');
const success = document.getElementById('success');

message.style.display = 'none';
message.innerText = '';
success.style.display = 'none';
success.innerText = '';


if(!firstName || !lastName || !username || !password || !confirmPassword) {
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
    body:JSON.stringify({firstName,lastName,username,password,confirmPassword})
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
    showMessage(success, 'Account created successfully! Redirecting to login...', 2000);

    setTimeout(() => {
      window.location.replace("/login");
    }, 1500);
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