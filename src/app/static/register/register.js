const form      = document.getElementById('regForm');
const username  = document.getElementById('username');
const email     = document.getElementById('email');
const password  = document.getElementById('password');
const confirm   = document.getElementById('confirm');
const toggles   = document.querySelectorAll('.toggle');

const ruleLen   = document.getElementById('rule-length');
const ruleUpper = document.getElementById('rule-upper');
const ruleSpec  = document.getElementById('rule-spec');

let visible = false;

toggles.forEach(btn=>{
    btn.addEventListener('click',()=>{
        visible = !visible;
        const type = visible ? 'text' : 'password';
        password.type = type;
        confirm.type  = type;
        toggles.forEach(b=>{
            b.innerHTML = visible
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';
        });
    });
});

password.addEventListener('input',updateRules);
confirm .addEventListener('input',updateConfirmRule);

password.addEventListener('focus',showMainRules);
username.addEventListener('focus',showMainRules);
confirm .addEventListener('focus',showConfirmRule);

function showMainRules(){
    const rules = document.getElementById('rules');
    rules.innerHTML = '';
    rules.append(ruleLen,ruleUpper,ruleSpec);
    updateRules();
}

function showConfirmRule(){
    const rules = document.getElementById('rules');
    rules.innerHTML = '';
    const matchRule = document.createElement('li');
    matchRule.id = 'rule-match';
    matchRule.textContent = 'Пароли совпадают';
    rules.append(matchRule);
    updateConfirmRule();
}

function updateRules(){
    ruleLen.classList.toggle('valid', password.value.length >= 6);
    const upper = /[A-Z]/.test(password.value) && /[a-z]/.test(password.value);
    ruleUpper.classList.toggle('valid', upper);
    ruleSpec.classList.toggle('valid', /[^A-Za-z0-9]/.test(password.value));
}

function updateConfirmRule(){
    const match = document.getElementById('rule-match');
    if (!match) return;
    match.classList.toggle('valid', password.value === confirm.value && confirm.value !== '');
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const pwdOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(password.value);
    const match = password.value === confirm.value;

    if (!pwdOk){
        showNotification('error','Пароль не удовлетворяет требованиям');
        return;
    }
    if (!match){
        showNotification('error','Пароли не совпадают');
        return;
    }

    showNotification('success','Успешная регистрация');
    form.reset();
    visible = false;
    toggles.forEach(b=>b.innerHTML='<i class="fa-solid fa-eye"></i>');
    password.type = confirm.type = 'password';
    showMainRules();
});
