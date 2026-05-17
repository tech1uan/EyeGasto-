const button = document.getElementById('register-btn');


async function registerUser() {
const username = document.getElementById('username-input').value
const email = document.getElementById('email-input').value;
const password = document.getElementById('password-input').value
const confirmPassword = document.getElementById('confirm-password-input').value;


const message = document.getElementById('message');
const success = document.getElementById('success');

message.style.display = 'none';
message.innerText = '';
success.style.display = 'none';
success.innerText = '';


if(!username || !email || !password || !confirmPassword) {
  message.style.display = 'block';
  message.innerText = 'Please fill in all fields';
  
  setTimeout(() => {
      message.style.display = 'none';
      message.innerText = '';
    },2000)
    
  return;
}

localStorage.setItem('email', email);

try {
  const res = await fetch('/auth/register', {
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({username,email,password,confirmPassword})
  });
  
  const data = await res.json();

  if(!res.ok){
    message.style.display = 'block';
    if(data.errors) {
    message.innerText = data.errors.map(err => err.msg).join(', ');
    } else {
      message.innerText = data.msg;
    }
  setTimeout(() => {
      message.style.display = 'none';
      message.innerText = '';
    },2000)
    
  } else {
     window.location.href = '/verify.html'
    setTimeout(() => {
      success.style.display = 'none';
    },2000)
  }} catch (error) {
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