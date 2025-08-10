document.addEventListener('DOMContentLoaded', () => {
  const setupForm = document.querySelector('form');
  setupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = document.getElementById('age').value;
    const language = document.getElementById('language').value;
    const level = document.getElementById('level').value;
    const profile = { age, language, level };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    window.location.href = 'dashboard.html';
  });
});
