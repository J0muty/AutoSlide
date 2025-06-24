const steps = Array.from(document.querySelectorAll('.step'));
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const topicInp = document.getElementById('topicInput');
const examples = document.querySelectorAll('.example');
const structureEl = document.getElementById('structureResult');

let current = 0;

function showStep(index) {
    steps[current].classList.remove('active');
    current = index;
    steps[current].classList.add('active');
    backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = current === steps.length - 1 ? 'Готово' : 'Далее';
}

examples.forEach(example => {
    example.addEventListener('click', () => {
        topicInp.value = example.textContent;
    });
});

backBtn.addEventListener('click', () => {
    if (current > 0) showStep(current - 1);
});

nextBtn.addEventListener('click', async () => {
    if (current === 0 && topicInp.value.trim() === '') {
        showNotification('error', 'Пожалуйста, введите тему презентации', 4000);
        return;
    }
    if (current === 1) {
        const slides = +document.getElementById('slidesInput').value;
        if (!slides || slides < 1) {
            showNotification('error', 'Введите корректное количество слайдов (минимум 1)', 4000);
            return;
        }
    }

    if (current === 2) {
        const payload = {
            topic: topicInp.value.trim(),
            slides: +document.getElementById('slidesInput').value,
            lang: document.querySelector('input[name="lang"]:checked').value
        };

        showStep(3);
        structureEl.textContent = 'Генерируем структуру, подождите…';

        try {
            const res = await fetch('/app/generate_structure', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Ошибка ответа сервера');
            const data = await res.json();
            structureEl.textContent = data.structure;
        } catch (err) {
            structureEl.textContent = 'Не удалось сгенерировать структуру: ' + err.message;
        }

        return;
    }

    if (current < steps.length - 1) {
        showStep(current + 1);
    } else {
        console.log('Всё готово');
    }
});

showStep(0);
