
const button = document.getElementById('login-btn')
async function login() {
  const login = document.getElementById('login-input').value;
  const password = document.getElementById('password-input').value;
  const message = document.getElementById('message');
  const success = document.getElementById('success');
  
  message.style.display = 'none';
  message.innerText = '';
  success.style.display = 'none';
  success.innerText = '';

  if(!login || !password) {
    message.style.display = 'block';
    message.innerText = 'Please fill in all fields'

  setTimeout(() => {
    message.style.display = 'none';
    message.innerText = '';
  }, 2000)

  return;
  }

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({login,password})
    });

    const data = await res.json();

    if(!res.ok) {
      message.style.display = 'block';
      message.innerText = `${data.msg}`
      setTimeout(() => {
        message.style.display = 'none'
      }, 3000);
    } else {
      success.style.display = 'block';
      success.innerText = `Logged in successfully!`;
      setTimeout(() => {
        success.style.display = 'none';
      },3000);
     
     window.location.href = '/index.html'
    }
    

  } catch (error) {
    console.log(error);
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