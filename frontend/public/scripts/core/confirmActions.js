

export function confirmMessage(message, onConfirm) {
  const existingModal = document.querySelector('.confirm-message-container');
  if(existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
 modal.className = 'confirm-message-container w-full fixed inset-0 z-50 flexhidden items-center justify-center'
  modal.style.background = 'rgba(0,0,0,0.6)'
  modal.innerHTML = 
  `

  <div class="inner-card relative w-full flex flex-col max-w-[360px] mx-4 rounded-[20px] p-7"
    style="
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(29,158,117,0.25);
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
      style="background: linear-gradient(135deg,#1a6b52,#0f4d3c); border:1px solid rgba(29,158,117,0.4); box-shadow:0 4px 16px rgba(29,158,117,0.2);">
      <i class="fa-solid fa-trash" style="font-size:20px; color:#5DCAA5;"></i>
    </div>

    <h1 class="text-[17px] font-semibold mb-2" style="color:#e8f5f0; letter-spacing:-0.01em;">
      Confirm action
    </h1>
    <p class="text-[14px] mb-6" style="color:rgba(200,230,220,0.7); line-height:1.55;">
      ${message}
    </p>

    <div class="flex gap-[10px]">
      <button class="js-yes-button flex-1 py-[11px] rounded-[12px] text-white text-[14px] font-semibold cursor-pointer transition-all hover:opacity-90"
        style="background:linear-gradient(135deg,#1d9e75,#0f6e56);">
        Yes
      </button>
      <button class="js-no-button flex-1 py-[11px] rounded-[12px] text-[14px] font-medium cursor-pointer transition-all hover:bg-white/10"
        style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); color:rgba(200,220,215,0.85);">
        No
      </button>
    </div>

  </div>
  `  

  document.body.append(modal);

  modal.style.display = 'flex';

  modal.querySelector('.js-close-confirm-message').addEventListener('click', ()=> {
    modal.remove();
  });

  modal.querySelector('.js-no-button').addEventListener('click', () => {
    modal.remove();
  })
 
  modal.querySelector('.js-yes-button').addEventListener('click', () => {
    if (onConfirm) onConfirm();
    modal.remove();
  })
}