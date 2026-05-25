import { loadUser } from "../data/user.js";



export async function initGreetings() {
  const user = await loadUser();
  const greetingContainer= document.querySelector('.greeting');
  
  const hour = new Date().getHours();
  let greeting;

  if(hour < 12) {
    greeting = 'Good morning!'
  } else if (hour < 18) {
    greeting = 'Good afternoon!'
  } else {
    greeting = 'Good evening!'
  }

  greetingContainer.innerHTML = `
  <p>${greeting},</p><h1 class ="font-bold">${user}!</h1>
  `
}

const gastooMessages = {
 home: [
  "Welcome back. Ready to manage your finances?",
  "A quick review today can make a big difference tomorrow.",
  "Your financial journey starts with small steps.",
  "Stay consistent and your goals will follow.",
  "Every smart decision counts.",
  "Keeping track of your money is a habit worth building.",
  "Take a moment to check your spending and budget.",
  "Good financial habits begin with awareness.",
  "Your progress is built one day at a time.",
  "A clear budget leads to better decisions.",
  "Start your day with confidence and a plan.",
  "Small savings can lead to big achievements.",
  "Keep working toward your financial goals.",
  "Your future self will appreciate today's efforts.",
  "Knowledge of your finances is a powerful tool.",
  "You're one step closer to financial control.",
  "Every peso has a purpose.",
  "Let's make today a productive financial day.",
  "Consistency is the foundation of success.",
  "Your finances deserve your attention."
],

expenses: [
  "I spotted a new expense.",
  "Another purchase has been recorded.",
  "Every peso tracked helps build better habits.",
  "Your expense history is up to date.",
  "Keep tracking to stay in control.",
  "Small expenses can add up quickly.",
  "Understanding your spending starts here.",
  "A well-tracked budget is a strong budget.",
  "Your financial journey is one entry at a time.",
  "Stay aware of where your money goes.",
  "Good tracking leads to smarter decisions.",
  "Every expense brings valuable insight.",
  "You've taken another step toward financial clarity.",
  "Review your expenses regularly for better results.",
  "Consistent tracking creates better habits.",
  "Your records are looking organized.",
  "Keep up the good work.",
  "Every entry helps tell your financial story.",
  "Tracking today helps you plan tomorrow.",
  "Let's keep your expenses organized."
] }

function typewriter(element,text,speed = 40) {
    element.textContent = '';
    let i = 0;

    const interval = setInterval(() => {
        if (i < text.length){
            element.textContent += text.charAt(i);
            i++
        } else {
            clearInterval(interval);
        }
    }, speed)
}

 function getRandomMessage(type) {
  const list = gastooMessages[type];
  return list[Math.floor(Math.random() * list.length)];
}

export function initGastooMessages() {
    const greet = document.querySelectorAll('.gastoo-greet');
    
    greet.forEach(g => {
      const type = g.dataset.type || 'home';

      let currentMessage = getRandomMessage(type);

      g.dataset.last = currentMessage;

      typewriter(g, currentMessage);

      setInterval(() => {
        let newMessage;
        do {
            newMessage = getRandomMessage(type);

        } while (newMessage === g.dataset.last);

        g.dataset.last = newMessage;
        typewriter(g, newMessage);
      }, 10000)
    })

}