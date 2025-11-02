const grid = document.getElementById("grid");
const timerEl = document.getElementById("timer");
const message = document.getElementById("message");
const nextLevelBtn = document.getElementById("nextLevel");
const restartBtn = document.getElementById("restart"); // yangi tugma
const exitBtn = document.getElementById("exit");
const levelEl = document.getElementById("level");

let level = 1;
let timeLeft = 60;
let timer;
let sequence = [];
let expected = 1;
let clickable = true;

function startLevel() {
  clickable = true;
  expected = 1;
  message.textContent = "";
  nextLevelBtn.style.display = "none";
  restartBtn.style.display = "none";

  // 4-darajadan keyin 2 daqiqa
  timeLeft = level >= 4 ? 120 : 60;
  timerEl.textContent = `⏰ ${timeLeft} soniya qoldi`;
  levelEl.textContent = `${level}-daraja`;

  const gridSize = Math.min(3 + level, 6);
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;
  grid.innerHTML = "";

  const numbers = Array.from({ length: gridSize * gridSize }, (_, i) => i + 1);
  sequence = shuffle(numbers);

  sequence.forEach(num => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = num;
    tile.addEventListener("click", () => handleTileClick(tile, num));
    grid.appendChild(tile);
  });

  startTimer();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    } else {
      timeLeft--;
      timerEl.textContent = `⏰ ${timeLeft} soniya qoldi`;
    }
  }, 1000);
}

function handleTileClick(tile, num) {
  if (!clickable) return;
  if (num === expected) {
    tile.classList.add("correct");
    expected++;
    if (expected > sequence.length) {
      clearInterval(timer);
      message.textContent = "🎉 Ajoyib! Siz darajani bajardingiz!";
      nextLevelBtn.style.display = "inline-block";
      restartBtn.style.display = "inline-block";
    }
  } else {
    tile.classList.add("wrong");
    message.textContent = "❌ Noto‘g‘ri tartib! Qayta urinib ko‘ring!";
  }
}

function nextLevel() {
  level++;
  if (level > 6) {
    message.textContent = "🏆 Barcha darajalarni tugatdingiz!";
    grid.innerHTML = "";
    nextLevelBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
  } else {
    startLevel();
  }
}

function endGame() {
  clickable = false;
  message.textContent = "⏰ Vaqt tugadi! Qayta urinib ko‘ring!";
  document.querySelectorAll(".tile").forEach(tile => {
    tile.style.pointerEvents = "none";
    tile.style.opacity = "0.5";
  });
  restartBtn.style.display = "inline-block";
}

// 🔹 Qayta o‘ynash tugmasi
restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  level = 1;
  startLevel();
});

// 🔹 O‘yindan chiqish tugmasi
exitBtn.addEventListener("click", () => {
  clearInterval(timer);
  clickable = false;
  grid.innerHTML = "";
  message.textContent = "🚪 Siz o‘yindan chiqdingiz.";
  setTimeout(() => {
    try {
      window.location.href = "index.html";
    } catch {
      alert("Asosiy sahifa topilmadi!");
    }
  }, 1500);
});

nextLevelBtn.addEventListener("click", nextLevel);

// 🎮 O‘yinni boshlaymiz
startLevel();
