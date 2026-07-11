
  let growthChart = null;
  let currentView = 'last7';
  let feedbackRange = 'all'
  let allFeedbacks = [];

function initToggleSidebar(open){
     const sidebarBtn = document.getElementById('sidebar-btn');
      const sidebar = document.getElementById('sidebar');

      sidebarBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        sidebar.classList.toggle('-translate-x-full');

      });

      document.body.addEventListener('click', (e) => {
        const isSideBarOpen = !sidebar.classList.contains('-translate-x-full');

        if(isSideBarOpen || !sidebar.contains(e.target)) {
          sidebar.classList.add('-translate-x-full');

        }
      })

  }
  document.querySelectorAll('.nav-item[data-section]').forEach(item=>{
    item.addEventListener('click', ()=>{
      document.querySelectorAll('.nav-item').forEach(n=>{
        n.classList.remove('bg-teal/15','border-teal/35','text-teal-bright');
        n.classList.add('border-transparent','text-mint');
      });
      item.classList.add('bg-teal/15','border-teal/35','text-teal-bright');
      item.classList.remove('border-transparent','text-mint');
      
    });
  });

  /* ---------------- Range pill ---------------- */
 document.querySelectorAll('.range-btn').forEach(btn => {
  btn.addEventListener('click', async () => {

    document.querySelectorAll('.range-btn').forEach(b => {
      b.classList.remove('active','bg-teal','text-[#04211b]');
      b.classList.add('text-mint/80');
    });

    btn.classList.add('active','bg-teal','text-[#04211b]');
    btn.classList.remove('text-mint/80');

    currentView = btn.dataset.range;

    await initAdminDashboard();
  });
});


  /* ---------------- Growth chart ---------------- */
  
  /* ---------------- Recent users (mock data — replace with API call) ---------------- */

 
 function renderUsers(list) {
  const body = document.getElementById('users-table-body');

  body.innerHTML = list.map((u) => {
    const status = getStatus(u.created_at, u.last_login);

    return `
      <tr class="fade-in">
        <td class="py-2.5 px-2.5 border-b border-white/5">
          <div class="flex items-center gap-2.5">
            <div class="w-[30px] h-[30px] rounded-full flex items-center justify-center font-extrabold text-[11px] text-[#052620] shrink-0">
              <img
                class="w-full h-full object-cover rounded-full"
                src="${u.profile_picture || '/images/user.png'}"
                alt="${u.username}'s profile picture"
              />
            </div>

            <div>
              <div class="font-bold text-[12.5px]">${u.full_name}</div>
              <div class="text-[10.5px] text-mint/70">${u.email}</div>
            </div>
          </div>
        </td>

        <td class="py-2.5 px-2.5 border-b border-white/5">${formatJoined(u.created_at)}</td>
        <td class="py-2.5 px-2.5 border-b border-white/5">${u.expensesLogged} logged</td>

        <td class="py-2.5 px-2.5 border-b border-white/5">
          <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide whitespace-nowrap ${
            status === 'New'
              ? 'bg-green-500/50'
              : status === 'Idle'
                ? 'bg-yellow-300 text-black'
                : 'bg-blue-500/50'
          }">
            ${status}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}
  

  async function initAdminLogout() {
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', async () => {
     try {
     const res = await authFetch('/auth/logout', {
            method: 'POST',
            });

        window.location.replace('/login');
        } catch (error) {
            console.log(error);
            return window.location.replace('/login');
        }
    })

  }


  async function initAdminProfile() {
    const adminName = document.getElementById('admin-name');
    const adminEmail = document.getElementById('admin-email');
    const adminProfile = document.getElementById('admin-profile');
    
    if(!adminName || !adminProfile || !adminEmail) return;

    try {
      let res = await authFetch('/users/', {
        method: 'GET'
      })

      const data = await res.json();

      if(!res.ok) {
        console.log(data.msg);
        return null;
      }
      
      console.log(data.user)
      
        const picture = data?.user?.profile_picture || 'images/user.png';
        const name = data?.user?.username ? data.user.full_name : 'Tracker';
        const email = data?.user?.email || 'Unknown';

      adminName.textContent = name
      adminEmail.textContent = email

      adminProfile.innerHTML = `
       <img class=" rounded-full object-cover" src="${picture}">
      `

    } catch (error) {
      console.error(error)
    }
  }

  

  async function initAdminDashboard() {
    const totalUsersContainer = document.getElementById('total-users');
    const totalUsersTipContainer = document.getElementById('total-users-tip');
    const activeTodayContainer = document.getElementById('active-today');
    const newSignupsContainer = document.getElementById('new-signups');
    const newSignupsTipContainer = document.getElementById('new-signups-tip'); 
    const feedbackCountContainer = document.getElementById('feedback-count');
    const feedbackCountTipContainer = document.getElementById('feedback-count-tip');

    if(!totalUsersContainer || !totalUsersTipContainer 
      || !activeTodayContainer || !newSignupsTipContainer || !newSignupsContainer || !feedbackCountContainer
    ||!feedbackCountTipContainer) return;

    try {
      
      let res = await authFetch(
          `/admin/dashboard?range=${currentView}&feedbackRange=${feedbackRange}`,
          {
              method: "GET"
          }
      );

      const data = await res.json();

      console.log(data)
      if(!res.ok) {
        console.log(data.msg)
      }


      const totalUsers = data?.totalUsers?.allTimeUsers?? 0;
      const percentChangeTotalUsers = data?.totalUsers?.percentChange?? 0;
      const activeToday = data?.activeUsers?.active_users_today?? 0;
      const newSignups = data?.signups?.newSignups?? 0;
      const percentChangeSignups = data?.signups?.newSignups?? 0;
  

      totalUsersContainer.textContent = totalUsers;
      totalUsersTipContainer.textContent = `${percentChangeTotalUsers}% vs last period`;
      activeTodayContainer.textContent = activeToday
      newSignupsContainer.textContent = newSignups;

      let range;

      if(currentView === 'last7') {
        range = 'this week'
      } else if(currentView === 'last30') {
        range = 'last 30 days'
      } else if(currentView === 'last90') {
        range = 'last 90 days'
      }
      newSignupsTipContainer.textContent = `${percentChangeSignups}% vs ${range} `

      const growthActive = data?.userGrowth?.activeUsers || [];
      const growthSignups = data?.userGrowth?.signups || [];

      const labels = [
        ...new Set([
          ...growthActive.map(item => item.day),
          ...growthSignups.map(item => item.day)
        ])
      ].sort();

  
      const formattedLabels = labels.map(day =>
        new Date(day).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
      );
      const activeData = labels.map(day => {
        const found = growthActive.find(item => item.day === day);
        return found ? Number(found.activeUsers) : 0;
      });

      const signupData = labels.map(day => {
        const found = growthSignups.find(item => item.day === day);
        return found ? Number(found.signups) : 0;
      });

    const growthCtx = document.getElementById("growthChart").getContext("2d");

    if (growthChart) {
        growthChart.destroy();
    }

    growthChart = new Chart(growthCtx, {
    type: 'line',
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Active Users',
          data: activeData,
          borderColor: '#1dc49a',
          backgroundColor: 'rgba(29,196,154,0.15)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#1dc49a'
        },
        {
          label: 'New Signups',
          data: signupData,
          borderColor: '#45E7EE',
          backgroundColor: 'rgba(69,231,238,0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#45E7EE'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8fb8ae', font:{size:11} } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8fb8ae', font:{size:11} } }
      }
    }
  });


     const usersRecently = data?.recentUsers?? 0;

     renderUsers(usersRecently)

    const userFeedbacks = data?.feedbacks?.feedbacks ?? [];

      allFeedbacks = userFeedbacks;

      const userFeedbackCounts = data?.feedbacks?.stats ?? {};


    feedbackCountContainer.textContent = userFeedbackCounts.totalFeedbacks
    feedbackCountTipContainer.innerHTML = `
    <p class="text-red-400 text-[11px] font-bold">
      <i class="fa-solid fa-check mr-1"></i>
      ${userFeedbackCounts.resolvedToday} resolved today
    </p>

    <p class="text-green-400 text-[11px] font-bold">
      <i class="fa-solid fa-plus mr-1"></i>
      ${userFeedbackCounts.newFeedbacks} new feedbacks today
    </p>

    `

    renderFeedback(userFeedbacks)

    } catch (error) {
      console.error(error);
      return null;
    }

  }




 async function setFeedbackStatus(id,status) {
    
        try {
            const res = await authFetch("/admin/set-feedback-status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, status })
            });

            if (!res.ok) {
                throw new Error("Failed to update status.");
            }

            console.log('Success!!')

        } catch (error) {
            console.error(error);
        }
  }
async function initFeedbackCardActions() {

    document.body.addEventListener("click", async (e) => {

        const resolveBtn = e.target.closest("#feedback-resolve-btn");
        const archiveBtn = e.target.closest("#feedback-delete-btn");
        const feedbackCard = e.target.closest(".feedback-card");

        if (!feedbackCard) return;

        const id = feedbackCard.dataset.id;
        const userId = feedbackCard.dataset.userId;
        const type = feedbackCard.dataset.type;
        const status = feedbackCard.dataset.status;
        const archived = Number(feedbackCard.dataset.archived);
   
        if (type !== "bug") {
            if (resolveBtn || archiveBtn) {
                e.stopPropagation();
            }
            return;
        }

        // Resolve button
        if (resolveBtn) {
            e.stopPropagation();

            if (status === "resolved") return;
          
            await setFeedbackStatus(id, "resolved");

            await pushNotificationToUser(
                userId,
                "happy",
                "Feedback resolved!",
                "Thanks for your feedback — we've resolved it!"
            );
       
            await initAdminDashboard();
            return;
        }

          
        if (archiveBtn) {
          e.stopPropagation();
          if (archived === 1) return;
          await archiveFeedback(id);
          await initAdminDashboard();

          return;
      }

        // Clicking card marks Bug Reports as reviewed
        if (status !== "new") return;

        await setFeedbackStatus(id, "reviewing");

        await pushNotificationToUser(
            userId,
            "happy",
            "Feedback reviewed!",
            "Thanks for your feedback — we've reviewed it!"
        );

        await initAdminDashboard();
    });

}


    function stars(n){
    return Array.from({length:5}, (_,i)=> i < n ? '★' : '☆').join('');
    }


    const tagLabel = {
      bug: 'Bug Report',
      idea: 'Idea',
      praise: 'Praise',
      other: 'Other'
    };

    const tagClasses = {
      bug: 'bg-red-400/15 text-red-400',
      idea: 'bg-teal-bright/15 text-teal-bright',
      praise: 'bg-teal/15 text-teal-300',
      other: 'bg-gray-400/15 text-gray-300'
    };

  function renderFeedback(list){
    const wrap = document.getElementById('fb-list');
    if(!list.length){
      wrap.innerHTML = `<p class="text-center text-mint/70 text-[13px] py-6">No feedback matches this filter.</p>`;
      return;
    }
    wrap.innerHTML = list.map(f =>   `
         <div class="feedback-card group relative fade-in ${f.status === 'new' ? 'cursor-pointer' : ''} bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:px-[18px] flex flex-col gap-2.5" data-id="${f.id}" data-status="${f.status}"  data-user-id="${f.user_id}" data-type="${f.type}" data-archived="${f.archived}">

        ${f.type === 'bug' && f.status === 'new' ? `
          <div class="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <span class="text-[12px] font-bold text-teal-bright flex items-center gap-1.5">
              <i class="fa-solid fa-check"></i> Click to mark as reviewed
            </span>
          </div>
        ` : ''}

        <div class="flex justify-between items-start gap-3 flex-wrap">
          <div class="flex items-center gap-2.5">
          <div class="w-[30px] h-[30px] rounded-full flex items-center justify-center font-extrabold text-[11px] text-[#052620] shrink-0">
              <img
                class="w-full h-full object-cover rounded-full"
                src="${f.profile_picture || '/images/user.png'}"
                alt="${f.username}'s profile picture"
              />
            </div>
            <div>
              <div class="text-[13px] font-extrabold">${f.full_name}</div>
              <div class="text-[10.5px] text-mint/70">${formatJoined(f.created_at)}</div>
            </div>
          </div>
          <div class="text-amber-400 text-[12px] tracking-[2px]">${stars(f.rating)}</div>
        </div>
        <div class="text-[13px] text-[#cfe9e2] leading-relaxed">${f.message}</div>
        <div class="flex gap-2 items-center flex-wrap">
        <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide ${tagClasses[f.type]}">${tagLabel[f.type]}</span>
            ${
            f.type === 'bug'
                ? (
                    f.status === 'new'
                        ? '<span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide bg-amber-400/20 text-amber-400">Needs review</span>'
                        : f.status === 'reviewing'
                            ? '<span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide bg-blue-500/15 text-blue-400">Reviewed</span>'
                            : '<span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide bg-green-500/15 text-green-400">Resolved</span>'
                )
                : ''
        }
      ${
            f.type === "bug"
              ? `
                <div class="ml-auto flex gap-2 relative z-20">

                  ${
                    f.status !== "resolved"
                      ? `
                        <button
                          id="feedback-resolve-btn"
                          class="w-[30px] h-[30px] rounded-[9px] border border-white/10 bg-white/[0.04] text-mint/80 flex items-center justify-center text-[12px] hover:text-teal-300 hover:border-teal/40 transition">
                          <i class="fa-solid fa-check"></i>
                        </button>
                      `
                      : `
                        <button
                          disabled
                          class="w-[30px] h-[30px] rounded-[9px] border border-white/10 bg-white/[0.04] text-gray-500 opacity-50 cursor-not-allowed flex items-center justify-center text-[12px]">
                          <i class="fa-solid fa-check"></i>
                        </button>
                      `
                  }

                  ${
                    f.archived === 1
                      ? `
                        <button
                          disabled
                          title="Archived"
                          class="w-[30px] h-[30px] rounded-[9px] border border-white/10 bg-white/[0.04] text-gray-500 opacity-50 cursor-not-allowed flex items-center justify-center text-[12px]">
                          <i class="fa-solid fa-box-archive"></i>
                        </button>
                      `
                      : `
                        <button
                          id="feedback-delete-btn"
                          title="Archive"
                          class="w-[30px] h-[30px] rounded-[9px] border border-white/10 bg-white/[0.04] text-mint/80 flex items-center justify-center text-[12px] hover:text-white hover:bg-white/[0.08] transition">
                          <i class="fa-solid fa-box-archive"></i>
                        </button>
                      `
                  }

                </div>
              `
              : ""
          }
        </div>
      </div>
    `).join('');
  }

  let activeFilter = 'all';

document.querySelectorAll(".fb-filter-btn").forEach(btn => {
    btn.addEventListener("click", async () => {

        document.querySelectorAll(".fb-filter-btn").forEach(b => {
            b.classList.remove(
                "active",
                "bg-teal",
                "border-teal",
                "text-[#04211b]"
            );

            b.classList.add(
                "bg-white/[0.04]",
                "border-white/10",
                "text-mint/80"
            );
        });

        btn.classList.add(
            "active",
            "bg-teal",
            "border-teal",
            "text-[#04211b]"
        );

        btn.classList.remove(
            "bg-white/[0.04]",
            "border-white/10",
            "text-mint/80"
        );

        feedbackRange = btn.dataset.filter;

        await initAdminDashboard();
    });
});



  document.getElementById('fb-search').addEventListener('input', applyFeedbackFilters);

function applyFeedbackFilters() {
    const keyword = document
        .getElementById("fb-search")
        .value
        .trim()
        .toLowerCase();

    const filtered = allFeedbacks.filter(f =>
        (f.full_name || "").toLowerCase().includes(keyword) ||
        (f.username || "").toLowerCase().includes(keyword) ||
        (f.message || "").toLowerCase().includes(keyword)
    );

    renderFeedback(filtered);
}

  function formatJoined(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    const diffDays = Math.floor(
        (today.setHours(0,0,0,0) - new Date(date).setHours(0,0,0,0))
        / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
        return `Today, ${date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })}`;
    }

    if (diffDays === 1) {
        return "Yesterday";
    }

    if (diffDays <= 7) {
        return `${diffDays} days ago`;
    }

    return date.toLocaleDateString();
}

async function archiveFeedback(id){

    try{

        const res = await authFetch("/admin/archive-feedback",{

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({id})

        });

        if(!res.ok){
            throw new Error("Failed to archive.");
        }

    }catch(error){
        console.error(error);
    }

}

function getStatus(userCreatedAt, userLastLogin) {
    const created = new Date(userCreatedAt);
    const lastLogin = new Date(userLastLogin);

    const now = new Date();


    let bgColor;


    const joinedDays =
        (now - created) / (1000 * 60 * 60 * 24);

    const activeDays =
        (now - lastLogin) / (1000 * 60 * 60 * 24);

    if (joinedDays <= 7)
        return "New";

    if (activeDays <= 7)
        return "Active";

    return "Idle";
}


export async function pushNotificationToUser(userId, mood, title, message) {
  try {

    const res = await authFetch('/admin/push', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ userId, mood, title, message })
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.msg);
      return null;
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

  export async function authFetch(url, options = {}) {
    console.log("Request:", url);

  let res = await fetch(url, {
    ...options,
    credentials:'include',
    
  })
  console.log("Status:", res.status);


    if(res.status === 401) {
          console.log("Refreshing token...");
        let refresh = await fetch('/auth/token', {
        method: 'POST',
        credentials:'include',
      });

  if(!refresh.ok) {
    console.log('Refreshing token failed!')
    window.location.replace('/login');
    return res;
  }

     console.log("Retrying request...");


    res = await fetch(url, {
      ...options,
      credentials: 'include'
    })

      console.log("Retry status:", res.status);
  } 

return res;
}

  async function initApp() {
    console.log('App is initializing!')
    try {
      let res = await authFetch('/app/auth', {
      method: 'GET',
      })

      if(!res.ok) {
        console.log('Token not refreshed!')
        window.location.replace('/login');
        return
      }
      
    await initAdminLogout()
    initToggleSidebar();
    await initAdminProfile();  
    await initAdminDashboard();
    await initFeedbackCardActions();

    } catch (error) {
      window.location.replace('/login');
        
      console.error(error);
      
    }
  }
  
  initApp();