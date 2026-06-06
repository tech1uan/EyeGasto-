
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
        button.addEventListener('click', () => {
            
        const targetSection = button.dataset.section;
        navTitle.textContent = button.dataset.title;

        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            section.classList.add('hidden');
        })
        
        document.querySelector(`.${targetSection}-section`).classList.remove('hidden');


        navButtons.forEach(btn => {
            btn.classList.remove('active');
        })

        button.classList.add('active');
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
    const financeButtons = document.querySelectorAll('.finance-nav');

    financeButtons.forEach(btn => {
       btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        if(type == 'add-savings' || type === 'withdraw-savings') {
            expensesInnerContainer.classList.add('hidden');
            addWithdrawOption.classList.remove('hidden');
        }
       })
    })

    const expensesNav = document.getElementById('expenses-nav-btn');
    const container = document.querySelector('.expenses-nav-container');


    expensesNav.addEventListener('click', () => {
        container.classList.remove('hidden');
    })

}

