const button = document.getElementById('register-btn');


async function registerUser() {
const username = document.getElementById('username-input').value
const password = document.getElementById('password-input').value

const message = document.getElementById('message');
const success = document.getElementById('success');

try {
  const res = await fetch('http://localhost:8000/auth/register', {
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({username,password})
  });
  
  const data = await res.json();

  if(!res.ok){
    message.style.display = 'block'
    message.innerText = `${data.msg}`
    setTimeout(() => {
      message.style.display = 'none';
    },2000)
  } else {
     success.style.display = 'block'
    success.innerText = `Account Registered Sucessfully!`
    setTimeout(() => {
      success.style.display = 'none';
    },2000)
  }} catch (error) {
  console.log(error);
}
}

button.addEventListener('click', registerUser);