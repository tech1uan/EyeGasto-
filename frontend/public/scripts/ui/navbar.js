import { initAnalytics } from "../features/analytics/analytics.js";

export function initNavbar() {
    const navButtons = document.querySelectorAll('.nav-btn');
    document.querySelector('.home-section').classList.remove('hidden');

    const seeAll = document.querySelector('.see-all-nav');
    
    let section;

      const navTitle = document.querySelector('.nav-title');
      navTitle.textContent = 'Home';


    navButtons.forEach(btn => {
        btn.classList.remove('active');
    })
    
    document.querySelector('[data-section="home"]').classList.add('active');


    navButtons.forEach(button => {
        button.addEventListener('click', async () => {
            
        const targetSection = button.dataset.section;
        navTitle.textContent = button.dataset.title;
        
        if(targetSection === 'analytics' || targetSection === 'profile' ) {
            document.querySelector('.gastoo-mascot-main-container').classList.add('hidden');
        } else {
            document.querySelector('.gastoo-mascot-main-container').classList.remove('hidden');
        }
        

        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            section.classList.add('hidden');
        })
        
        document.querySelector(`.${targetSection}-section`).classList.remove('hidden');

    
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        })

        button.classList.add('active');

         if(targetSection === 'analytics') {
             await initAnalytics()
        }


        })

        
    })

    
 
    seeAll.addEventListener('click', () => {
        document.querySelector('.home-section').classList.add('hidden');
        document.querySelector('.expenses-section').classList.remove('hidden');

        document.querySelector('.expenses-nav').classList.add('active');
        document.querySelector('.home-nav').classList.remove('active');
    })

    
    const withdrawSavingsNav = document.getElementById('withdraw-savings-navigator');
    const expensesInnerContainer = document.querySelector('.expenses-nav-inner-container');
    const addWithdrawOption = document.querySelector('.add-withdraw-option-container');
    const expensesNavContainer = document.querySelector('.expenses-nav-container');
    const financeButtons = document.querySelectorAll('.finance-nav');

    financeButtons.forEach(btn => {
       btn.addEventListener('click', () => {
        const type = btn.dataset.type;

        if(type === 'add-savings') {
         addWithdrawOption.classList.remove('hidden');
         document.querySelector('.add-withdraw-title').textContent = 'Add Savings';
         document.getElementById('js-budget-button').innerHTML = ` <i class="fa-solid fa-plus"></i>Deposit`
         document.getElementById('js-budget-button').dataset.type = 'add';
         document.getElementById('add-withdraw-description').textContent = 'Add money to your savings to grow your balance and reach your financial goals faster.'
         document.getElementById('savings-icon').classList.remove('fa-arrow-down');
         document.getElementById('savings-icon').classList.add('fa-plus');
        } else if (type === 'withdraw-savings') {
         addWithdrawOption.classList.remove('hidden');
         document.querySelector('.add-withdraw-title').textContent = 'Withdraw Savings';
         document.getElementById('js-budget-button').innerHTML = `<i class="fa-solid fa-arrow-down"></i>Withdraw`
         document.getElementById('js-budget-button').dataset.type = 'withdraw';
         document.getElementById('add-withdraw-description').textContent = 'Withdraw money from your savings for expenses or personal use. Your balance will decrease accordingly.'
         document.getElementById('savings-icon').classList.remove('fa-plus');
        document.getElementById('savings-icon').classList.add('fa-arrow-down');
        }
       })
    })

    const expensesNav = document.getElementById('expenses-nav-btn');
    const container = document.querySelector('.expenses-nav-container');
    const closeExpensesNavBtn = document.getElementById('close-expenses-nav-btn')
    
    if(!expensesNav || !container || !closeExpensesNavBtn) return;

    expensesNav.addEventListener('click', () => {
        container.classList.remove('hidden');
    
    })
   
    closeExpensesNavBtn.addEventListener('click', () => {
            container.classList.add('hidden');
        }
    )
    
    const userProfileNavToProfileSection = document.getElementById('user-profile-container')

   userProfileNavToProfileSection.addEventListener('click', () => {
     document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
            document.querySelector('.gastoo-mascot-main-container').classList.add('hidden');

        });

     document.querySelector('.profile-section').classList.remove('hidden');

     document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

     document.querySelector('.profile-navbar').classList.add('active');
     document.querySelector('.nav-title').textContent = 'Profile';
});

}

