import { updateExpensesChart } from "../charts/expensesChart.js";
import { API_BASE } from "../config.js";
import { confirmMessage } from "../core/confirmActions.js";
import { initAnalytics } from "../features/analytics/analytics.js";
import { updateExpenseHeatMap } from "../features/analytics/analyticsHeatMap.js";
import { updateTotalExpenses } from "../features/expenses/totalExpenses.js";
import { getCurrentExpenses } from "../features/expenses/viewExpense.js";
import { initGoal } from "../features/savings_goal/goal.js";
import { authFetch } from "../main.js";
import { hideLoading, showLoading } from "../ui/loading.js";
import { renderBudget } from "../ui/renderBudget.js";
import { renderExpensesHTML } from "../ui/renderExpenses.js";
import { renderSavingsHTML } from "../ui/renderSavings.js";
import { showMessage } from "../withdrawals/addWithdraw.js";

import { getProfileStats } from "./expenses.js";
import { userSavings } from "./savings.js";



export async function getUser() {
  try {
    const res = await authFetch ('/users/', {
      method: 'GET',
    })

    const data = await res.json();

    if(!res.ok) {

      return null
    } else {
      return data;
    }

  } catch (error) {
    console.error(error);
    return null;
  }
}



export async function clearData() {
  try {
    const res = await authFetch ('/users/clear-data', {
      method: 'DELETE',
    })

    const data = await res.json();

    if(!res.ok) {
      return null
    } else {
      return data;
    }

  } catch (error) {
    console.error(error);
    return null;
  }
}




export let user = 'Tracker';

export async function setProfilePicture(file) {

  const success = document.getElementById('success-upload-profile');
  const error = document.getElementById('error-upload-profile');

  try {
    const formData = new FormData();
    formData.append("profile", file);

    const res = await authFetch('/users/profile-picture', {
      method: 'PATCH',
      body: formData
    });

    const data = await res.json();

    if(!res.ok) {
      showMessage(error, data.msg);
      return {
        success: false,
        message: data
      }
    }

    showMessage(success, 'Profile uploaded successfully!')

    return data;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export function updateSavingsUI(money, targetAmount) {
  const currentSavings = Number(money || 0);
  const savingsGoal = Number(targetAmount || 0);
  const goalPercent = savingsGoal === 0 ? 0 : Number(Math.round((currentSavings / savingsGoal) * 100));

  const percentElem = document.getElementById('goal-reached-percent');
  if (percentElem) percentElem.textContent = `${goalPercent}%`;
}

export function updateProfileImagesUI(pictureUrl) {
  const picture = pictureUrl || 'images/user.png';
  
  const avatarImg = document.querySelector('#profile-avatar img');
  const avatarImgB = document.querySelector('#edit-profile-pic-container img');
  if (avatarImg) {
    avatarImg.src = picture;
  }

  if(avatarImgB) {
    avatarImgB.src = picture;
  }

  const container = document.getElementById('user-profile-container');
  if (container) {
    container.innerHTML = `<img src="${picture}" class="rounded-full w-8 h-8 object-cover" alt="User default avatar">`;
  }
}

export async function loadUser() {
  const [data, userProfileStats, savings] = await Promise.all([
    getUser(),
    getProfileStats(),
    userSavings()
  ]);

  user = data?.user?.first_name || 'Tracker'; 
  const picture = data?.user?.profile_picture || `${API_BASE}/images/user.png`;

  const name = data?.user?.username ? data.user.full_name : 'Tracker';
  const email = data?.user?.email || 'Unknown';

  const expensesLogged = userProfileStats?.profileStats?.expenses_logged || '0';
  const monthsActive = userProfileStats?.profileStats?.months_active || '0';

  
  document.getElementById('profile-avatar').innerHTML = `
    <img class="w-20 h-20 rounded-full object-cover" src="${picture}">
    <div id="set-profile-pic" class="absolute bottom-0 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#054d57] cursor-pointer">
      <i class="fa-solid fa-camera text-[11px] text-white"></i>
    </div>
    <input id="profile-input" type="file" accept="image/*" hidden>
  `;

  document.getElementById('edit-profile-pic-container').innerHTML = `
    <img class="w-16 h-16 rounded-full object-cover" src="${picture}">
    <div id="edit-profile-pic" class="absolute bottom-0 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#054d57] z-100 cursor-pointer">
      <i class="fa-solid fa-camera text-[11px] text-white"></i>
    </div>
    <input id="edit-profile-pic-input" type="file" accept="image/*" hidden>
  `;

  document.getElementById('profile-name').textContent = name;
  document.getElementById('edit-profile-name').textContent = name;
  document.getElementById('profile-email').textContent = email;
  document.getElementById('expenses-logged-num').textContent = expensesLogged;
  document.getElementById('months-active-num').textContent = monthsActive;

  updateSavingsUI(savings?.money, savings?.targetAmount);
  updateProfileImagesUI(picture);


  const cameraBtn = document.getElementById('set-profile-pic');
  const profileInput = document.getElementById('profile-input');
  const editProfileCameraBtn = document.getElementById('edit-profile-pic');
  const editProfilePicInput = document.getElementById('edit-profile-pic-input')

  cameraBtn.addEventListener('click', () => profileInput.click());
  editProfileCameraBtn.addEventListener('click', () => editProfilePicInput.click());

  profileInput.addEventListener('change', async () => {
    const file = profileInput.files[0];
    if (!file) return;

    const result = await setProfilePicture(file);
    if (result) {
      loadUser();
    }
  });

  
  editProfilePicInput.addEventListener('change', async () => {
    const file = editProfilePicInput.files[0];
    if (!file) return;

    const result = await setProfilePicture(file);
    if (result) {
      loadUser();
    }
  });



  return user;
}


export async function initClearDataBtn() {
const clearDataBtn = document.getElementById('clear-data-btn');
   
clearDataBtn.addEventListener("click", async () => {
confirmMessage('red',`<strong>This will permanently delete all your expenses and reset your savings and monthly budget. This action cannot be undone.</strong>`, async () => {

  try {
    await clearData(),
              
     await Promise.all([ 
       initAnalytics(),
       loadUser(),
       updateTotalExpenses(),
       updateExpensesChart(),
       updateExpenseHeatMap(),
       initGoal(),
       renderBudget(),
       renderSavingsHTML(),
    ])

     const expenses = await getCurrentExpenses();  

     renderExpensesHTML(expenses, "home"),
     renderExpensesHTML(expenses, "expenses")
  
  } catch (err) {
    console.error(err);
  }
});
   })
}

export async function initEditProfileBtn () {
  
  const data = await getUser();
  const userFirstName = data.user.first_name;
  const userLastName = data.user.last_name;
  const userEmail = data.user.email
  const username = data.user.username;

  const editProfileContainer = document.querySelector('.edit-profile-container');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const cancelProfileBtn = document.getElementById('cancel-profile-btn');
  
  document.getElementById('input-first-name').value = userFirstName;
  document.getElementById('input-last-name').value = userLastName;
  document.getElementById('input-email').value = userEmail;
  document.getElementById('input-username').value = username;

  editProfileBtn.addEventListener('click', () => { 
    if (editProfileContainer){
     editProfileContainer.classList.remove('hidden');
    }
  })
  
    cancelProfileBtn.addEventListener('click', () => {
      editProfileContainer.classList.add('hidden');
    })
}

export async function initSaveChangesOnProfileEdit() {


  const saveBtn = document.getElementById('save-profile-btn');
  
  if(!saveBtn) return;
 
  saveBtn.addEventListener('click', async () => {
  const newFirstName = document.getElementById('input-first-name').value;
  const newLastName = document.getElementById('input-last-name').value;
  const newUsername = document.getElementById('input-username').value;
  const newEmail = document.getElementById('input-email').value;
  const originalEmail = document.getElementById('profile-email').textContent;

  const success = document.getElementById('success-edit-profile');
  const error = document.getElementById('error-edit-profile');
  
  if(!success || !error) return;

  const isEmailChanging = newEmail !== originalEmail;
  
  if(!newFirstName || !newLastName || !newUsername || !newEmail) {
    showMessage(error, 'Please fill in all fields');
    return;
  }

  if(isEmailChanging) {
    try {
      const res = await authFetch(`${API_BASE}/users/request-email-change`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({newEmail})
      });
      
      const data = await res.json();

      if(!res.ok) {
         const errors = data.errors 
        ? data.errors.map(err => err.msg).join(', ')
        : data.message || data.msg || 'Something went wrong';
        showMessage(error, errors, 3000);
        return null;
      }

        showVerificationInput();
    
    } catch (error) {
      console.error(error);
      return null
    }
  } else {
    confirmMessage('green',`<strong>Are you sure you want to save this changes?</strong>`, async () => {
      saveBtn.disabled = true;
      showLoading(saveBtn);
      try {
          const res = await authFetch(`${API_BASE}/users/update-profile`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              newFirstName,newLastName,newUsername
              })
            })

          const data = await res.json();
  
          if(!res.ok) {
            const errors = data.errors 
          ? data.errors.map(err => err.msg).join(', ')
          : data.message || data.msg || 'Something went wrong';
            showMessage(error, errors, 3000);
            return null
          } else {
            showMessage(success, 'Edited successfully!', 3000);
            await loadUser();
            await initGreetings()
      
            return data;
          }

        } catch (error) {
          console.error(error);
          return null;
        } finally {
          hideLoading(saveBtn);
        }
  })

  }})

}

export async function initGreetings() {
  const user = await loadUser();
  const greetingContainer= document.querySelector('.greeting');
  
  const hour = new Date().getHours();
  let greeting;

  if(hour < 12) {
    greeting = 'Good morning'
  } else if (hour < 18) {
    greeting = 'Good afternoon!'
  } else {
    greeting = 'Good evening!'
  }

  greetingContainer.innerHTML = `
  <p>${greeting},</p><h1 class ="font-bold">${user}!</h1>
  `
}


function showVerificationInput() {
  document.getElementById('verification-section').classList.remove('hidden');
  document.getElementById('submit-verification-btn').addEventListener('click', async () => {
    const code = document.getElementById('input-verification-code').value;

    const res = await authFetch(`${API_BASE}/users/verify-email-change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
 
    if(!res.ok) {
      showMessage(document.getElementById('verify-error'), data.msg);
    } else {
      showMessage(document.getElementById('success-edit-profile'), 'Email updated successfully!', 3000);
      document.getElementById('verification-section').classList.add('hidden');
      document.getElementById('save-profile-btn').classList.remove('hidden');
      await loadUser();
      document.querySelector('.edit-profile-container').classList.add('hidden');

    }
  },{once:true});

  const cancelBtn = document.getElementById('cancel-verification-btn');

  cancelBtn.addEventListener('click', () => {
    document.getElementById('verification-section').classList.add('hidden');
  },{once:true})
}

export async function initChangePasswordEdit() {
  const openChangePasswordModalBtn = document.getElementById('change-password-btn');
  const changePasswordModal = document.querySelector('.change-password-container')
  const closeChangePasswordModalBtn = document.getElementById('cancel-password-btn');
 
  document.getElementById('input-current-password').value = "";
  document.getElementById('input-new-password').value = "";
  document.getElementById('input-confirm-password').value = "";
  
  openChangePasswordModalBtn.addEventListener('click', () => {
    
  if(openChangePasswordModalBtn) {
  changePasswordModal.classList.remove('hidden');
  }}
)

  closeChangePasswordModalBtn.addEventListener('click', () => {
    changePasswordModal.classList.add('hidden')
  })


  document.querySelectorAll('[class*="js-toggle"]').forEach(icon => {
    icon.addEventListener('click', () => {
    

      const input = icon.previousElementSibling;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !isPassword);
      icon.classList.toggle('fa-eye-slash', isPassword);
    })
  })
}

export async function initSetNewPassword() {
  
  const saveBtn = document.getElementById('save-password-btn');
  
  if(!saveBtn) return;

  saveBtn.addEventListener('click', async () => {
    const currentPassword = document.getElementById('input-current-password').value;
    const newPassword = document.getElementById('input-new-password').value;
    const confirmPassword = document.getElementById('input-confirm-password').value; 

    if(!currentPassword || !newPassword || !confirmPassword) {
      showMessage(document.getElementById('error-change-password'), 'Please fill in all fields');
      return;
    }
   
    confirmMessage('green', 'Are you sure you want to set this new password?', async () => {
    showLoading(saveBtn);
      try {
      const res = await authFetch(`${API_BASE}/users/set-new-password`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({currentPassword, newPassword, confirmPassword})
      })

      const data = await res.json();

      if(!res.ok) {
        const errors = data.errors? data.errors.map(err => err.msg).join(', ')
          : data.message || data.msg || 'Something went wrong';
            showMessage(document.getElementById('error-change-password'), errors);
            return null;
      }

      showMessage(document.getElementById('success-change-password'), 'Password set successfully!');
    } catch (error) {
      console.error(error)
      return null;
    } finally {
      hideLoading(saveBtn);
    }
    })
    
  })
}


export async function getNotificationStatus() {
  try {
    const res = await authFetch(`${API_BASE}/notifications/notif-status`);

    const data = await res.json();

    if (!res.ok) {
      return { success: false };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return null;
  }

}

export async function markTipShown() {
     try {
      const res = await authFetch(`${API_BASE}/notifications/tip`, {
        method: 'PATCH'
    });

    if(!res.ok) {
      return null
    }
     } catch (error) {
      console.error(error);
      return null
     }

}

export async function markReminderShown() {
     try {
      const res = await authFetch(`${API_BASE}/notifications/reminder`, {
        method: 'PATCH'
    });

    if(!res.ok) {
      return null
    }
     } catch (error) {
      console.error(error);
      return null
     }

}