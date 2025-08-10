// Handle sign up form
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    const planSelect = document.getElementById('planSelect');
    if (planParam) {
        planSelect.value = planParam;
    }
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const user = {
            name: data.name,
            email: data.email,
            plan: data.plan
        };
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'setup.html';
    });
});
