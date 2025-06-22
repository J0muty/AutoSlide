const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');

if (localStorage.getItem('autoslide_user')) {
    loginBtn?.remove();
    signupBtn?.remove();
}

burger.addEventListener('click', () => {
    nav.classList.toggle('open');
});
