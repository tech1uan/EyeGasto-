
export function initNavbar() {
    const navButtons = document.querySelectorAll('.nav-btn');
    document.querySelector('.home-section').classList.remove('hidden');
    
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
}