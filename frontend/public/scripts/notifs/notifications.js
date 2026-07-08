import { getRelativeTime, isToday } from "../core/utils.js";
import { loadUser } from "../data/user.js";
import { authFetch } from "../main.js";


let currentUser = null; 

export async function initUser() {
  currentUser = await loadUser();
  return currentUser;
}
const NOTIF_TYPES = {
  newUser: {
    emoji: "🎉",
    title: (user) => `Welcome Aboard <strong>${user}</strong>!`,
    message: "Hi there! We're excited to have you start your budgeting journey today!",
    bg: "rgba(27, 126, 95, 0.82)",
    border: "rgba(255,255,255,0.18)",
    bar: "#6ef3c2",
  },

  existingUser: {
    emoji: "👋",
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
    bg: "rgba(18, 105, 78, 0.82)",
    border: "rgba(255,255,255,0.18)",
    bar: "#59e3b5",
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
  
  const title = typeof t.title === 'function'?t.title(user) : t.title

  const container = document.getElementById('notif-container');
  const el = document.createElement('div');
  el.className = `notif font-['DM_Sans']`;
  el.style.cssText = `background:${t.bg}; border-color:${t.border};`;

  el.innerHTML = `
          <img src = "images/gastoo-assets/gastoo-happy-face.png" class = "w-15 h-15">
    <div class="flex-1 ">
      <div class="'font-['DM_Sans]' font-bold" style="color:#fff;font-size:13px;margin-bottom:2px">${title}</div>
      <div style="color:rgba(210,240,245,0.85);font-size:10px;font-weight:600;line-height:1.4">${message}</div>
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


const GASTOO_FACES = {
  happy: `images/gastoo-assets/gastoo-happy-face.png`,
  excited: `images/gastoo-assets/gastoo-excited-face.png`,
  concerned: `images/gastoo-assets/gastoo-concerned-face.png`,
  worried: `images/gastoo-assets/gastoo-worried-face.png`
}

const panel     = document.getElementById('notif-panel');
const overlay   = document.getElementById('notif-overlay');
const bellBtn   = document.getElementById('notif-bell-btn');
const closeBtn  = document.getElementById('notif-close-btn');
const markAllBtn = document.getElementById('notif-mark-all-btn');
const badge     = document.getElementById('notif-badge');
const emptyState = document.getElementById('notif-empty');

  updateBadge()
  checkEmpty()
  
 function openPanel() {
  panel.classList.remove('-translate-x-full');
  panel.classList.add('translate-x-0');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
 }

 function closePanel() {
  panel.classList.add('-translate-x-full');
  panel.classList.remove('translate-x-0');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  overlay.classList.remove('opacity-100');
  document.body.style.overflow = '';
 }

 bellBtn.addEventListener('click', openPanel);
 closeBtn.addEventListener('click', closePanel)

document.querySelectorAll('.notif-row').forEach(row => {
  row.addEventListener('click', () => {
  row.classList.remove('unread','bg-[#EBF8F7]')
  row.querySelector('.notif-unread-dot')?.remove()
   row.querySelector('.notif-title')?.classList.replace('text-black', 'text-black/50');
  updateBadge()
  checkEmpty()
  })

})

markAllBtn.addEventListener('click', () => {
  document.querySelectorAll('.notif-row').forEach(row => {
    
    row.classList.remove('unread','bg-[#EBF8F7]')
    row.querySelector('.notif-unread-dot')?.remove()
    row.querySelector('.notif-title')?.classList.replace('text-black', 'text-black/50');
     
    setIsRead(Number(row.dataset.id));

  })
  updateBadge()
  checkEmpty()
},{once:true})

 function updateBadge(){
  const count = document.querySelectorAll('.notif-row.unread').length;
  if(count === 0) {
   badge.classList.add('hidden')
  } else {
    badge.classList.remove('hidden');
    badge.textContent = count;
  }
 }

 function checkEmpty() {
  const todayHas = document.querySelector('.notif-today')?.children.length > 0;
  const monthlyHas = document.querySelector('.notif-monthly')?.children.length > 0;

  const hasAny = todayHas || monthlyHas;

  emptyState.classList.toggle('hidden', hasAny);

  document.querySelectorAll('.notif-range').forEach(el => {
    el.classList.toggle('hidden', !hasAny);
  });
}

export async function renderNotifications() {
  try {
    const res = await authFetch('/notifications/get', {
      method: 'GET'
    })

    const data = await res.json();
    console.log(data.notifications, 'from render notifications')

    if(!res.ok) {
      return null
    };
    const todayPanel = document.getElementById("notif-panel-today");
    const earlierPanel = document.getElementById("notif-panel-earlier");

    todayPanel.innerHTML = "";
    earlierPanel.innerHTML = "";
    
    if (!data.notifications || !Array.isArray(data.notifications)) {
      console.log("Invalid response:", data);
      return;
    }

    

  data.notifications.forEach(notification => {

    const id = notification.notification_id
     const  mood = notification.mood
     const title = notification.title
     const msg = notification.message
    const time = notification.created_at

     const face = GASTOO_FACES[mood] || GASTOO_FACES.happy;

    const bgMap  = {
      happy: 'bg-[#CDF1E7]',
      excited: 'bg-[#FFE3A6]',
      concerned: 'bg-[#FBE3B8]',
      worried: 'bg-[#F8D9D2]',
    }

  
      let className;
      let innerHTML;

      console.log(isToday(time))
  
    if(notification.is_read === 1) {
       className = `notif-row flex items-start gap-[10px] p-[11px] rounded-2xl cursor-pointer
                hover:bg-[#f0fdfa] transition-colors duration-150 relative
                `
          innerHTML = `
      
        <div class="notif-gastoo-icon mood-concerned
                  w-10 h-10 p rounded-full flex items-center justify-center
                    bg-[#FBE3B8] overflow-hidden">

                  <img src="${face}" 
                      class="block w-15 h-15 object-contain" 
                      alt="icon" />

                </div>
              <div class="flex-1 min-w-0">
                <p class="notif-title font-['DM_Sans'] font-bold text-[13px] text-black/50">${title}</p>
                <p class="font-['DM_Sans'] text-[11.5px] text-black/50 leading-[1.4] mt-0.5">
                  ${msg}
                </p>
                <span class="font-['DM_Sans'] text-[10.5px] text-black/30 mt-1.5 block">${getRelativeTime(time)}</span>
              </div>
        
      `
    } else {

        className = `notif-row unread flex items-start gap-[10px] p-[11px] rounded-2xl cursor-pointer
                bg-[#EBF8F7] hover:bg-[#f0fdfa] transition-colors duration-150 relative`

        innerHTML = `<div class="notif-gastoo-icon mood-concerned
              w-10 h-10 p rounded-full flex items-center justify-center
                bg-[#FBE3B8] overflow-hidden">

              <img src="${face}" 
                  class="block w-15 h-15 object-contain" 
                  alt="icon" />

            </div>
          <div class="flex-1 min-w-0">
            <p class="notif-title font-['DM_Sans'] font-bold text-[13px] text-black">${title}</p>
            <p class="font-['DM_Sans'] text-[11.5px] text-black/50 leading-[1.4] mt-0.5">
              ${msg}
            </p>
            <span class="font-['DM_Sans'] text-[10.5px] text-black/30 mt-1.5 block">${getRelativeTime(time)}</span>
          </div>
          <span class="notif-unread-dot w-2 h-2 rounded-full bg-[#079F9F] flex-shrink-0 mt-1"></span>`
    }

      const row = document.createElement('div');
      row.className = className
      row.dataset.id = id;
      row.dataset.mood = mood;

      row.innerHTML = innerHTML

     row.addEventListener('click', () => {
            row.classList.remove('unread','bg-[#EBF8F7]')
            row.querySelector('.notif-unread-dot')?.remove()
            row.querySelector('.notif-title')?.classList.replace('text-black', 'text-black/50');
            setIsRead(row.dataset.id);
            checkEmpty()
            updateBadge()
          })

          if(isToday(time)) {
          todayPanel.appendChild(row)
          } else {
            earlierPanel.appendChild(row)
          }
  })

      updateBadge();
      checkEmpty();
    
  } catch (error) {
    return null;
  }
}

export async function pushNotification(mood,title,message) {
  try {
    const res = await authFetch('/notifications/add', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({mood,title,message})
    })

    const data = await res.json();

    if(!res.ok) {
      console.log(data.msg)
      return null;
    }
   
    await renderNotifications();

   
   return data;
  } catch (error) {
    console.error(error);
    return null
  }


}


export async function setIsRead(notificationId) {
  try {
    const res = await authFetch('/notifications/set-read', {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({notificationId})
    })
  } catch (error) {
    console.error(error);
    return null
  }
}