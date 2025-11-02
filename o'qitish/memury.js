const board = document.getElementById("game-board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const exitBtn = document.getElementById("exit");

let emojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍒", "🍉", "🍋"];
let cards = [...emojis, ...emojis]; // juftliklar
let firstCard = null;
let secondCard = null;
let lock = false;
let matched = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  board.innerHTML = "";
  shuffle(cards).forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = emoji;

    card.addEventListener("click", () => {
      if (lock || card.classList.contains("flipped")) return;

      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        tekshir();
      }
    });

    board.appendChild(card);
  });
}

function tekshir() {
  if (firstCard.textContent === secondCard.textContent) {
    firstCard = null;
    secondCard = null;
    matched += 2;

    if (matched === cards.length) {
      message.textContent = "🎉 Barakalla! Hammasini topding!";
      setTimeout(() => {
        message.textContent = "";
        nextLevel();
      }, 1500);
    }
  } else {
    lock = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lock = false;
    }, 800);
  }
}

function nextLevel() {
  emojis.push("⭐", "🌙"); // yangi belgilar qo‘shiladi
  cards = [...emojis, ...emojis];
  matched = 0;
  createBoard();
}

restartBtn.addEventListener("click", () => {
  emojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍒", "🍉", "🍋"];
  cards = [...emojis, ...emojis];
  matched = 0;
  createBoard();
  message.textContent = "";
});

exitBtn.addEventListener("click", () => {
  if (confirm("O‘yindan chiqmoqchimisiz?")) {
    window.location.href = "7-11_yoshlar.html"; // Asosiy menyuga qaytish
  }
});

createBoard();
