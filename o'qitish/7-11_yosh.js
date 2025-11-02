const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const levelEl = document.getElementById("level");
const timerEl = document.getElementById("timer");
const exitBtn = document.getElementById("exit");

let level = 1;
let correctAnswers = 0;
let totalQuestions = 10;
let timeLeft = 60;
let timer;
let currentAnswer;

const sounds = {
  correct: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"),
  wrong: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-failure-arcade-alert-notification-240.mp3"),
  levelup: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-video-game-level-completed-2059.mp3")
};

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏰ ${timeLeft} soniya qoldi`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function generateQuestion() {
  const max = level === 1 ? 10 : level === 2 ? 20 : 50;
  const num1 = Math.floor(Math.random() * max) + 1;
  const num2 = Math.floor(Math.random() * max) + 1;
  const operators = ["+", "-", "*"];
  const op = operators[Math.floor(Math.random() * operators.length)];

  currentAnswer = eval(`${num1}${op}${num2}`);
  questionEl.textContent = `${num1} ${op} ${num2} = ?`;

  // rangli fon almashsin
  const colors = [
    "linear-gradient(135deg,#f6d365,#fda085)",
    "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
    "linear-gradient(135deg,#84fab0,#8fd3f4)",
    "linear-gradient(135deg,#fccb90,#d57eeb)"
  ];
  document.body.style.background = colors[Math.floor(Math.random() * colors.length)];
}

function checkAnswer() {
  const userAnswer = Number(answerEl.value);
  if (userAnswer === currentAnswer) {
    feedbackEl.textContent = "✅ To‘g‘ri!";
    feedbackEl.style.color = "#00c853";
    correctAnswers++;
    sounds.correct.play();
  } else {
    feedbackEl.textContent = `❌ Noto‘g‘ri! To‘g‘ri javob: ${currentAnswer}`;
    feedbackEl.style.color = "#e53935";
    sounds.wrong.play();
  }

  progressEl.textContent = `To‘g‘ri javoblar: ${correctAnswers}/${totalQuestions}`;
  answerEl.value = "";

  if (correctAnswers === totalQuestions) {
    nextLevel();
  } else {
    generateQuestion();
  }
}

function confettiAnimation() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function nextLevel() {
  clearInterval(timer);
  confettiAnimation();
  feedbackEl.textContent = "🎉 Ajoyib! Daraja tugadi!";
  sounds.levelup.play();

  setTimeout(() => {
    level++;
    if (level > 3) {
      questionEl.textContent = "🏆 Tabriklaymiz! Siz barcha darajalarni tugatdingiz!";
      feedbackEl.textContent = "";
      progressEl.textContent = "";
      return;
    }
    correctAnswers = 0;
    timeLeft = 60;
    levelEl.textContent = `${level}-daraja`;
    feedbackEl.textContent = "";
    progressEl.textContent = "";
    startTimer();
    generateQuestion();
  }, 3000);
}

function endGame() {
  questionEl.textContent = "⏰ Vaqt tugadi!";
  feedbackEl.textContent = "Boshidan urinib ko‘ring!";
  submitBtn.disabled = true;
}

submitBtn.addEventListener("click", checkAnswer);
exitBtn.addEventListener("click", () => {
  window.location.href = "index.html"; // bosh sahifaga qaytadi
});

startTimer();
generateQuestion();
