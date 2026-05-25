import { hideLoading, showLoading } from "../ui/loading.js";

let messageTimer = null;

function showMessage(el,text, duration = 3000) {
    clearTimeout(messageTimer);
    el.style.display = 'block';
    el.innerText = text,
    messageTimer = setTimeout(() => {
      el.style.display = 'none';
      el.innerText = '';
    }, duration);
  }


async function verifyEmail() {

  const email = localStorage.getItem('email');
  const code = document.getElementById('code-input').value;
  const success = document.getElementById('success');
  const message = document.getElementById('message');
  const verifyBtn = document.getElementById('verify-btn');

  if(!email) {
    window.location.href = '/register.html';
    return;
  }

showLoading(verifyBtn);

  try {
    let res = await fetch('/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({email,code})
    });

    const data = await res.json();

    if(!res.ok) {
      showMessage(message, data.msg, 3000)
    } else {
      showMessage(success,data.msg, 3000)

      window.location.href = '/login.html'
    }

  } catch (error) {
    console.log(error);
  } finally {
    hideLoading(verifyBtn);
  }
}

let countdown;

function startCooldown(duration = 30) {

  clearInterval(countdown);
  
  const success = document.getElementById('success');
  const resendBtn = document.getElementById('resend-btn');
  let seconds = duration;

  resendBtn.disabled = true;

  localStorage.setItem('resendCooldown', Date.now() + seconds * 1000);

  success.style.display = 'block'
  success.innerText = `Resend code in ${seconds}s`;

  countdown = setInterval (() => {

    seconds--;
    success.innerText = `Resend code in ${seconds}s`;

    if(seconds <=0) {
      clearInterval(countdown);
      resendBtn.disabled = false;
      success.style.display = 'none'

      localStorage.removeItem('resendCooldown');
    }
  }, 1000)
}

async function resendCode() {
  const email = localStorage.getItem('email');
  const message = document.getElementById('success');

  try {
    const res = await fetch('/auth/resend-code', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({email})
    });

    const data = await res.json();

    if(!res.ok) {
     showMessage(message, data.msg, 3000) 
     return;
    }else {
      startCooldown();
      showMessage(message,data.msg, 3000)
    }
  } catch (error) {
    console.error(error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
 
  const cooldown = Number(localStorage.getItem('resendCooldown'));

  if(cooldown) {
    const remaining = Math.floor((cooldown - Date.now()) / 1000);

    if(remaining > 0) {
      startCooldown(remaining);
    }
  } else {
    startCooldown();
  }
  
document.getElementById('resend-btn').addEventListener('click', resendCode);
document.getElementById('verify-btn').addEventListener('click', verifyEmail);
}) 
