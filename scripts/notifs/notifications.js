import { formatToPeso } from "../core/utils.js";


const NOTIF_TYPES = {
  budgetOut: {
    emoji: '😱',
    title: "Budget's All Gone!",
    message: "You've used up today's budget. Hold your spending, bestie! 🛑",
    bg: 'linear-gradient(135deg,#2a1218,#3d1212)',
    border: 'rgba(255,100,100,0.45)',
    bar: '#ff4e4e',
  },
  budgetLow: {
    emoji: '⚠️',
    title: 'Budget Running Low!',
    message: "You've used more than half your budget — spend wisely! 💪",
    bg: 'linear-gradient(135deg,#2a2010,#3d2e08)',
    border: 'rgba(245,166,35,0.45)',
    bar: '#f5a623',
  },
  greetings: {
    emoji: '🎉',
    title: 'Congratulations!',
    message: `Wow you have a huge budget for today!`,
    bg: 'linear-gradient(135deg,#102a20,#083d28)',
    border: 'rgba(0,212,160,0.45)',
    bar: '#00d4a0',
  },
};

export function showNotif(type) {
  const t = NOTIF_TYPES[type];
  if (!t) return;

  const container = document.getElementById('notif-container');
  const el = document.createElement('div');
  el.className = 'notif';
  el.style.cssText = `background:${t.bg}; border-color:${t.border};`;

  el.innerHTML = `
    <div style="font-size:30px;flex-shrink:0">${t.emoji}</div>
    <div style="flex:1;min-width:0">
      <div class="fredoka" style="color:#fff;font-size:15px;margin-bottom:2px">${t.title}</div>
      <div style="color:rgba(210,240,245,0.85);font-size:12px;font-weight:600;line-height:1.4">${t.message}</div>
    </div>
    <button onclick="dismissNotif(this)" style="color:rgba(255,255,255,0.35);font-size:16px;background:none;border:none;cursor:pointer;padding:0;flex-shrink:0">✕</button>
    <div class="notif-bar" style="background:${t.bar}"></div>
  `;

  el.onclick = (e) => { if (e.target.tagName !== 'BUTTON') dismissNotif(el.querySelector('button')); };
  container.appendChild(el);
  setTimeout(() => dismissNotif(el.querySelector('button')), 4200);
}

export function dismissNotif(btn) {
  const el = btn?.closest?.('.notif') ?? btn;
  if (!el || el.classList.contains('hide')) return;
  el.classList.add('hide');
  setTimeout(() => el.remove(), 380);
}

export function checkBudget(currentBudget, originalBudget) {
  const percentLeft = (currentBudget / originalBudget) * 100;

  if (currentBudget <= 0) {
    if (!checkBudget._outShown) { 
      checkBudget._outShown = true; showNotif('budgetOut');
     }
    return;
  }
  if (percentLeft < 50) {
    if (!checkBudget._lowShown) { 
      checkBudget._lowShown = true; showNotif('budgetLow');
     }
    return;
  }

  checkBudget._outShown = false;
  checkBudget._lowShown = false;
}
