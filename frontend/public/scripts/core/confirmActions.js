const themes = {
  red: {
    border: 'rgba(239,68,68,0.25)',
    iconBg: 'rgba(239,68,68,0.15)',
    iconBorder: 'rgba(239,68,68,0.3)',
    iconShadow: 'rgba(239,68,68,0.2)',
    iconColor: '#f87171',
    icon: 'fa-trash',
    btnBg: '#ef4444',
    btnHover: 'hover:bg-red-600',
    btnTextColor: '#fff',
  },
  green: {
      border: 'rgba(10,158,138,0.25)',
      iconBg: 'rgba(10,158,138,0.15)',
      iconBorder: 'rgba(10,158,138,0.3)',
      iconShadow: 'rgba(10,158,138,0.2)',
      iconColor: '#0a9e8a',
      icon: 'fa-check',
      btnBg: '#0a9e8a',
      btnHover: 'hover:opacity-90',
      btnTextColor: '#fff',
    }
};

export function confirmMessage(color = 'green', message, onConfirm) {
  const existingModal = document.querySelector('.confirm-message-container');
  if (existingModal) existingModal.remove();

  const t = themes[color] || themes.green;

  const modal = document.createElement('div');
  modal.className = 'confirm-message-container w-full fixed inset-0 z-[100] flex items-center justify-center';
  modal.style.background = 'rgba(0,0,0,0.6)';

  modal.innerHTML = `
  <div class="inner-card relative w-full flex flex-col max-w-[360px] mx-4 rounded-[20px] p-7"
    style="
      background: rgba(255,255,255,0.06);
      border: 1px solid ${t.border};
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
      font-family: 'DM Sans', sans-serif;
    ">

    <button class="js-close-confirm-message absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white/15"
      style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);">
      <i class="fa-solid fa-x" style="font-size:11px; color:rgba(200,230,220,0.7);"></i>
    </button>

    <div class="mb-4 flex items-center justify-center w-[52px] h-[52px] rounded-[14px]"
      style="background:${t.iconBg}; border:1px solid ${t.iconBorder}; box-shadow:0 4px 16px ${t.iconShadow};">
      <i class="fa-solid ${t.icon}" style="font-size:20px; color:${t.iconColor};"></i>
    </div>

    <h1 class="text-[17px] font-semibold mb-2" style="color:#e8f5f0; letter-spacing:-0.01em;">
      Confirm action
    </h1>
    <p class="text-[14px] mb-6" style="color:rgba(200,230,220,0.7); line-height:1.55;">
      ${message}
    </p>

    <div class="flex gap-[10px]">
      <button class="js-yes-button ${t.btnHover} flex-1 py-[11px] rounded-[12px] text-[14px] font-semibold cursor-pointer transition-all"
        style="background:${t.btnBg}; color:${color === 'red' ? '#fff' : '#042f35'};">
        Yes
      </button>
      <button class="js-no-button flex-1 py-[11px] rounded-[12px] text-[14px] font-medium cursor-pointer transition-all hover:bg-white/10"
        style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); color:rgba(200,220,215,0.85);">
        No
      </button>
    </div>

  </div>
  `;

  document.body.append(modal);
  modal.style.display = 'flex';

  modal.querySelector('.js-close-confirm-message').addEventListener('click', () => modal.remove());
  modal.querySelector('.js-no-button').addEventListener('click', () => modal.remove());
  modal.querySelector('.js-yes-button').addEventListener('click', () => {
    if (onConfirm) onConfirm();
    modal.remove();
  });
}