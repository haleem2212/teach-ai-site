document.addEventListener('DOMContentLoaded', () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  if (!userInfo || !profile) {
    window.location.href = 'index.html';
    return;
  }
  // Display name and plan
  const userNameEl = document.getElementById('user-name');
  if (userNameEl) {
    userNameEl.textContent = `${userInfo.name} (${userInfo.plan})`;
  }
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userProfile');
      window.location.href = 'index.html';
    });
  }
  // Accessible subjects by plan
  const planSubjects = {
    basic: ['math'],
    standard: ['math', 'english', 'science'],
    premium: ['math', 'english', 'science', 'languages', 'coding']
  };
  const allowed = planSubjects[userInfo.plan] || [];
  document.querySelectorAll('.subject-grid .subject').forEach(card => {
    const subjectName = card.id.replace('-card', '');
    if (!allowed.includes(subjectName)) {
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'none';
      card.setAttribute('title', 'Upgrade your plan to access this subject');
    }
  });
});
