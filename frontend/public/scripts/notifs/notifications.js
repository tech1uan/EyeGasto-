import { loadUser } from "../data/user.js";


let currentUser = null; 

export async function initUser() {
  currentUser = await loadUser();
  return currentUser;
}

const NOTIF_TYPES = {
  budgetExceeded: {
    emoji: '😱',
    title: "Oops!",
    message: "You've exceeded today's budget limit. Please pause spending! 🛑",
    bg: 'linear-gradient(135deg,#2a1218,#3d1212)',
    border: 'rgba(255,100,100,0.45)',
    bar: '#ff4e4e',
  },
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
    message: `Wow that's a great budget for today!`,
    bg: 'linear-gradient(135deg,#102a20,#083d28)',
    border: 'rgba(0,212,160,0.45)',
    bar: '#00d4a0',
  },

newUser: {
  emoji: '🎉',
  title: (user) => `Welcome Aboard <strong>${user}</strong>!`,
  message: `Hi there! We're excited to have you start your budgeting journey today!`,
  bg: 'linear-gradient(135deg,#1a2a3a,#0b1f2e)',
  border: 'rgba(0,212,160,0.45)',
  bar: '#00d4a0',
},

existingUser: {
  emoji: '👋',
  title: (user) => `Welcome Back <strong>${user}</strong>!`,
  message: {
  a: `Good to see you again! Let's make today another productive day for your budget.`,
  b: `Welcome back! Ready to stay on top of your spending today?`,
  c: `A fresh start for your budget today. You've got this! 💪`,
  d: `Back again! Let's keep your finances on track.`,
  e: `Another day, another chance to manage your budget wisely.`,
  f: `Hey there! Let's make smart money moves today.`,
  g: `Welcome back! Your budget is ready when you are.`,
  h: `Time to check in on your budget and keep things balanced.`,
  i: `New day, new budget goals. Let's go!`,
  j: `Glad you're here! Let's keep your spending in check today.`,
  k: `Your budget journey continues today—let's make it count.`,
  l: `Welcome back! Small decisions today build stronger finances tomorrow.`,
},
  bg: 'linear-gradient(135deg,#102a20,#083d28)',
  border: 'rgba(0,150,255,0.45)',
  bar: '#0096ff',
},
pdfReady: {
  emoji: '💾',
  title: `Your Data is Ready to Download!`,
  message: {
    a: `You can now export your expense report as a PDF. Tap the download button to save your data!`,
    b: `PDF export is available! Download your full expense and transaction history anytime.`,
    c: `Your EyeGasto report is ready. Download it as a PDF and keep your records safe. 📥`,
    d: `New feature! You can now download your budget data as a PDF report.`,
    e: `Export your expenses and transactions to PDF — great for reviewing or sharing your budget.`,
    f: `Keep a copy of your finances! Download your data as a PDF report anytime you need it.`,
    g: `Your expense history, transactions, and category breakdown — now downloadable as PDF!`,
    h: `Stay organized! Export your full EyeGasto report to PDF with just one tap.`,
    i: `PDF download is here! Your budget data is now just a tap away.`,
    j: `Back up your budget! Download your expense report as a PDF and keep your records handy.`,
    k: `New: Export your data to PDF! Track your progress and share your budget report easily.`,
    l: `Your financial data deserves a backup. Download your EyeGasto report as a PDF today!`,
  },
  bg: 'linear-gradient(135deg,#0a1a2e,#0d3b5e)',
  border: 'rgba(30,144,255,0.45)',
  bar: '#1e90ff',
},
};

export async function showNotif(type) {

  const user = currentUser;

  const t = NOTIF_TYPES[type];
  if (!t) return;

   let message = t.message;

   if(type === "existingUser") {
   let existingUserMessages = Object.keys(t.message);
   let randomIndex = Math.floor(Math.random() * existingUserMessages.length);
   const randomMessage = existingUserMessages[randomIndex];
    message = t.message[randomMessage];
   }

   if(type === "pdfReady") {
   let pdfUpdateMessages = Object.keys(t.message);
   let randomIndex = Math.floor(Math.random() * pdfUpdateMessages.length);
   const randomMessage = pdfUpdateMessages[randomIndex];
    message = t.message[randomMessage];
   }
  
  const title = typeof t.title === 'function'?t.title(user) : t.title

  const container = document.getElementById('notif-container');
  const el = document.createElement('div');
  el.className = `notif font-['Poppins']`;
  el.style.cssText = `background:${t.bg}; border-color:${t.border};`;

  el.innerHTML = `
    <div style="font-size:30px;flex-shrink:0">${t.emoji}</div>
    <div style="flex:1;min-width:0">
      <div class="fredoka font-bold" style="color:#fff;font-size:15px;margin-bottom:2px">${title}</div>
      <div style="color:rgba(210,240,245,0.85);font-size:12px;font-weight:600;line-height:1.4">${message}</div>
    </div>
    <button class = "dismiss-btn" style="color:rgba(255,255,255,0.35);font-size:16px;background:none;border:none;cursor:pointer;padding:0;flex-shrink:0">✕</button>
    <div class="notif-bar" style="background:${t.bar}"></div>
  `;

  const dismissBtn = el.querySelector('.dismiss-btn');

  dismissBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissNotif(el);
  })

  el.onclick = (e) => { 
    if (e.target.tagName !== 'BUTTON')
       dismissNotif(el.querySelector('button')); };
  container.appendChild(el);
  setTimeout(() => dismissNotif(el.querySelector('button')), 4200);
}

export function dismissNotif(btn) {
  const el = btn?.closest?.('.notif') ?? btn;
  if (!el || el.classList.contains('hide')) return;
  el.classList.add('hide');
  setTimeout(() => el.remove(), 380);
}

