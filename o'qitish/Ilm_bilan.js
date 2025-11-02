// royhat.js — registration logic using localStorage
(function () {
  const form = document.getElementById('royxatForm');
  const msg = document.getElementById('msg');

  function showMessage(text, ok = false) {
    msg.textContent = text;
    msg.style.color = ok ? '#0a6' : '#b00020';
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('ilm_users') || '[]');
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem('ilm_users', JSON.stringify(users));
  }

  function emailValid(email) {
    // simple RFC-like check (not perfect but fine for frontend)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.textContent = '';

    const name = String(document.getElementById('ism').value || '').trim();
    const ageVal = document.getElementById('yosh').value;
    const email = String(document.getElementById('email').value || '').trim().toLowerCase();
    const pass = String(document.getElementById('parol').value || '');
    const agree = document.getElementById('qabul').checked;

    // Basic validation
    if (!name) return showMessage('Iltimos, ismingizni kiriting.');
    const age = Number(ageVal);
    if (!ageVal || Number.isNaN(age)) return showMessage('Iltimos, yoshingizni to‘g‘ri kiriting.');
    if (age < 7 || age > 20) return showMessage('Dastur 7 yoshdan 20 yoshgacha bo‘lganlar uchun mo‘ljallangan.');
    if (!email || !emailValid(email)) return showMessage('Iltimos, to‘g‘ri email kiriting.');
    if (!pass || pass.length < 6) return showMessage('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
    if (!agree) return showMessage('Iltimos, xizmat shartlariga rozilik bildiring.');

    // Check existing users
    const users = getUsers();
    const exists = users.find(u => u.email === email);
    if (exists) return showMessage('Bu email bilan foydalanuvchi allaqachon ro‘yxatdan o‘tgan. Iltimos, kirish qiling yoki boshqa email ishlating.');

    // Create user object (DO NOT store plaintext password in production)
    const user = {
      id: 'u_' + Date.now(),
      name,
      age,
      email,
      password: pass, // NOTE: for production hash the password on server
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);

    // Mark as current user
    localStorage.setItem('ilm_current', JSON.stringify({ id: user.id, name: user.name, age: user.age, email: user.email }));

    showMessage('Ro‘yxatdan muvaffaqiyatli o‘tildi! Yo‘naltirilmoqda...', true);

    // Short delay for UX then redirect by age group
    setTimeout(() => {
      if (age >= 7 && age <= 11) {
        window.location.href = '7-11_yoshlar.html';
      } else if (age >= 12 && age <= 15) {
        window.location.href = '12-15/index.html';
      } else if (age >= 16 && age <= 20) {
        window.location.href = '16-20/index.html';
      } else {
        // fallback to homepage
        window.location.href = 'index.html';
      }
    }, 900);
  });
})();
