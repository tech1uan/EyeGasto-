const gastooMessages = {

  happy: [
    "Your future self will appreciate today's efforts.",
    "Every peso has a purpose.",
    "Good financial habits begin with awareness.",
    "Small savings can lead to big achievements.",
    "Keep working toward your financial goals.",
    "A clear budget leads to better decisions.",
    "Consistency is the foundation of success.",
    "Stay consistent and your goals will follow.",
    "Your progress is built one day at a time.",
    "Knowledge of your finances is a powerful tool.",
    "Every smart decision counts.",
    "Let's make today a productive financial day.",
    "Keep track of your money — it's worth the habit.",
    "Start your day with confidence and a plan.",
    "You're one step closer to financial control.",
  ],

  excited: [
    "You're crushing it today! 🎉",
    "That's what I'm talking about — keep it up!",
    "Spending less than usual? Gastoo approves!",
    "A new milestone! You're doing amazing!",
    "Look at you go — saving and thriving!",
    "Your wallet is happy. Gastoo is happy.",
    "This is the kind of day your future self loves!",
    "You hit a savings goal! Time to aim higher!",
    "Below budget AND on track? Incredible!",
    "Gastoo does a little dance for you! 🕺",
  ],

  concernedDaily: [
    "Hmm... you're getting close to today's budget.",
    "Heads up — today's spending is climbing.",
    "Just a gentle nudge: check today's budget.",
    "You're at 70% of today's budget already.",
    "Maybe slow down on spending for the rest of the day?",
    "Gastoo's a little concerned about today's spending.",
    "Getting close to today's limit — be careful.",
    "A quick budget check could help you finish the day strong.",
    "Today's spending trend is going up. Stay aware.",
    "Almost at today's budget limit — let's be careful.",
  ],

  concernedMonthly: [
    "Hmm... you're getting close to your monthly budget.",
    "Heads up — this month's spending is adding up.",
    "Just a gentle reminder: keep an eye on your monthly budget.",
    "You've already used a large portion of this month's budget.",
    "Try to slow down on spending for the rest of the month.",
    "Gastoo's keeping an eye on your monthly spending.",
    "You're getting close to your monthly limit.",
    "A little caution now can help you finish the month on budget.",
    "Your monthly spending is trending upward. Stay mindful.",
    "Almost at your monthly budget — let's finish the month strong.",
  ],

    worriedDaily: [
    "Uh oh... you've gone over today's budget.",
    "Daily budget exceeded. Let's slow down for the rest of the day.",
    "Gastoo is worried. Today's spending is higher than planned.",
    "You've spent more than today's budget.",
    "Today went over budget, but tomorrow is a fresh start.",
    "Daily spending is in the red. Let's be careful.",
    "You've reached today's limit. Time to pause.",
    "Today's budget has been exceeded. Review your spending.",
    "One expensive day doesn't define your progress.",
    "Gastoo believes you can get back on track tomorrow.",
  ],

  worriedMonthly: [
    "Uh oh... you've gone over your monthly budget.",
    "Monthly budget exceeded. Time to review your spending.",
    "Gastoo is concerned about this month's expenses.",
    "You've spent more than your monthly plan allows.",
    "Your monthly budget is in the red.",
    "This month's spending is higher than expected.",
    "The monthly limit has been exceeded. Let's regroup.",
    "A budget review could help get things back on track.",
    "There's still time to make smarter spending choices this month.",
    "Gastoo believes you can finish the month stronger.",
  ],

  proud: [
    "Amazing! You stayed within your budget.",
    "Gastoo is proud of your smart spending!",
    "Budget goal achieved! Keep it up.",
    "You're making every peso count.",
    "Excellent work! Your spending is on track.",
    "Financial discipline looks good on you.",
    "Great job! Today's budget is under control.",
    "Another win for your wallet!",
    "Gastoo cheers! You're building great habits.",
    "You're proving that consistency pays off.",
  ],

  bothBudgetExceeded: [
  "Uh oh... both your daily and monthly budgets are exceeded.",
  "You're over both today's limit and your monthly plan. Time to slow down.",
  "Gastoo is worried — daily and monthly budgets are both in the red.",
  "You've exceeded today's spending and your monthly budget at the same time.",
  "Double alert: daily and monthly budgets have been surpassed.",
  "This is a heavy spending day — both limits are already exceeded.",
  "You're over budget today and for the month. Let's reset tomorrow.",
  "Gastoo recommends stopping unnecessary spending for now.",
  "Both budgets are exceeded — take a pause and review your spending.",
  "You've gone past both limits. Tomorrow is a fresh restart.",
],

bothBudgetConcerned: [
  "Careful — you're close to exceeding both daily and monthly budgets.",
  "You're approaching both limits. Stay mindful with spending.",
  "Gastoo is watching closely — both budgets are getting tight.",
]

};


const messageToMoodMap = {
  happy: "happy",
  excited: "excited",

  concernedDaily: "concerned",
  concernedMonthly: "concerned",

  worriedDaily: "worried",
  worriedMonthly: "worried",

  bothBudgetExceeded: "worried",
  bothBudgetConcerned: "concerned"
};


const moodPriority = {
  worried: 4,
  concerned: 3,
  excited: 2,
  happy: 1
};


let moodQueue = [];
let moodResetTimer = null;


function typewriter(element, text, speed = 40) {
  if (!element) return;

  if (element._typewriterInterval) {
    clearInterval(element._typewriterInterval);
    element._typewriterInterval = null;
  }

  element.textContent = "";
  let i = 0;

  element._typewriterInterval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(element._typewriterInterval);
      element._typewriterInterval = null;
    }
  }, speed);
}

function getRandomMessage(mood = "happy") {
  const list = gastooMessages[mood] || gastooMessages.happy;
  return list[Math.floor(Math.random() * list.length)];
}


export function pushGastooMood(messageType, durationMs = 19000) {
  const id = Date.now() + Math.random();

  const mood = messageToMoodMap[messageType] || "happy";

  moodQueue.push({
    id,
    messageType,
    mood
  });

  renderTopMood();

  clearTimeout(moodResetTimer);
  moodResetTimer = setTimeout(() => {
    resetToHappy();
  }, durationMs);
}

function renderTopMood() {
  if (moodQueue.length === 0) return;
  
  let best = moodQueue[0];
  let bestScore = -1;


  
  for(const item of moodQueue) {
    const score = moodPriority[item.mood];

    if(score > bestScore) {
      bestScore = score
      best = item 
    }

  }
   

  
  const face = document.querySelector(".gastoo-container");

  if (face) {
    face.classList.remove(
      "gastoo-happy",
      "gastoo-excited",
      "gastoo-concerned",
      "gastoo-worried"
    );

    face.classList.add(`gastoo-${best.mood}`);
  }
  
  const msg = getRandomMessage(best.messageType);
  
 const g = document.querySelector(".gastoo-greet");
  
 if(g) {
  g.dataset.last = msg;
  typewriter(g,msg);
 }
}

function resetToHappy() {
  moodQueue = [];

  const face = document.querySelector(".gastoo-container");

  if (face) {
    face.classList.remove(
      "gastoo-happy",
      "gastoo-excited",
      "gastoo-concerned",
      "gastoo-worried"
    );

    face.classList.add("gastoo-happy");
  }
}

export function initGastooMessages() {
  pushGastooMood('happy');

  const greetEls = document.querySelectorAll('.gastoo-greet');

   setInterval(() => {
    if (moodQueue.length > 0) return;

    greetEls.forEach(g => {
      let newMessage;
      do {
        newMessage = getRandomMessage("happy");
      } while (newMessage === g.dataset.last);

      g.dataset.last = newMessage;
      typewriter(g, newMessage);
    });
  }, 10000);
}