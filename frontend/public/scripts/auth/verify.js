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


export async function verifyEmail() {

  const email = localStorage.getItem('email');
  const code = document.getElementById('code-input').value;
  const success = document.getElementById('success');
  const message = document.getElementById('message');
  const verifyBtn = document.getElementById('verify-btn');

  if(!email) {
   window.location.replace('/register');
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

       console.log("VERIFY SUCCESS");

      showMessage(success,data.msg, 3000)

      localStorage.removeItem("email");
      localStorage.removeItem("resendCooldown");
      localStorage.removeItem("autoResend");

      setTimeout(()=>{
      window.location.replace('/login');
    },1500);
    }

  } catch (error) {
    console.log(error);
  } finally {
    hideLoading(verifyBtn);
  }
}

let countdown;

export function startCooldown(duration = 3) {

  clearInterval(countdown);
  
  const cooldown = document.getElementById('cooldown');
  const resendBtn = document.getElementById('resend-btn');
  if(!cooldown || !resendBtn) return;
    let seconds = duration;


  resendBtn.disabled = true;

  localStorage.setItem('resendCooldown', Date.now() + seconds * 1000);

  cooldown.style.display = 'block'
  cooldown.innerText = `Resend code in ${seconds}s`;

  countdown = setInterval (() => {

    seconds--;
    cooldown.innerText = `Resend code in ${seconds}s`;

    if(seconds <=0) {
      clearInterval(countdown);
      resendBtn.disabled = false;
      cooldown.style.display = 'none'

      localStorage.removeItem('resendCooldown');
    }
  }, 1000)
}

async function resendCode() {
  const email = localStorage.getItem('email');

      if (!email) {
      window.location.replace('/register');
      return;
    }
  
  const message = document.getElementById('success')
  const error = document.getElementById('message');
  const cooldown = document.getElementById('cooldown');
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
     showMessage(error, data.msg, 5000) 
     return;
    }else {
      showMessage(message,data.msg, 3000)
      return true
    }
  } catch (error) {
    console.error(error)
  }
}
document.addEventListener('DOMContentLoaded', async () => {

  const email = localStorage.getItem("email");
  const resendBtn = document.getElementById('resend-btn');
  const verifyBtn = document.getElementById('verify-btn');

  if (!email) {
    return;
  }

  const savedCooldown = Number(localStorage.getItem('resendCooldown'));

  if (savedCooldown) {
    const remaining = Math.floor((savedCooldown - Date.now()) / 1000);

    if (remaining > 0) {
      startCooldown(remaining);
    } else {
      localStorage.removeItem('resendCooldown');
      resendBtn.disabled = false;
    }

  } else {
    const success = await resendCode();

    if (success) {
      startCooldown();
    }
  }

  resendBtn?.addEventListener('click', async () => {
    const success = await resendCode();

    if (success) {
      startCooldown();
    }
  });


  verifyBtn?.addEventListener('click', verifyEmail);

});