
let messageTimer = null;

export function showMessage(el,text, duration = 3000) {
    clearTimeout(messageTimer);
    el.style.display = 'block';
    el.innerText = text,
    messageTimer = setTimeout(() => {
      el.style.display = 'none';
      el.innerText = '';
    }, duration);
  }
