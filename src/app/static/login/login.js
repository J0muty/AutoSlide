const password = document.getElementById('password');
const toggles = document.querySelectorAll('.toggle');
let visible = false;

toggles.forEach(btn => {
    btn.addEventListener('click', () => {
        visible = !visible;
        password.type = visible ? 'text' : 'password';
        toggles.forEach(b => b.innerHTML = visible ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>');
    });
});