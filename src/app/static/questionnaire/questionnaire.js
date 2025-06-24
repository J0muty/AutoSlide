const steps = Array.from(document.querySelectorAll('.step'));
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const topicInp = document.getElementById('topicInput');
const examples = document.querySelectorAll('.example');
const placeholderText = document.getElementById('placeholderText');
const slidesContainer = document.getElementById('slidesContainer');

let current = 0;

function showStep(index) {
    steps[current].classList.remove('active');
    current = index;
    steps[current].classList.add('active');
    backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = current === steps.length - 1 ? 'Готово' : 'Далее';
}

examples.forEach(ex => {
    ex.addEventListener('click', () => {
        topicInp.value = ex.textContent;
    });
});

backBtn.addEventListener('click', () => {
    if (current > 0) {
        showStep(current - 1);
    }
});

nextBtn.addEventListener('click', async () => {
    if (current === 0 && !topicInp.value.trim()) {
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
        placeholderText.textContent = 'Генерируем структуру, подождите…';
        placeholderText.style.display = 'block';
        slidesContainer.classList.add('hidden');

        try {
            const res = await fetch('/app/generate_structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error('Ошибка ответа сервера');
            }

            const { structure } = await res.json();
            renderSlides(structure);

        } catch (err) {
            placeholderText.textContent = 'Не удалось сгенерировать структуру: ' + err.message;
        }

        return;
    }

    if (current < steps.length - 1) {
        showStep(current + 1);
    }
});

let sortable;

function enableDragging() {
    if (sortable) sortable.destroy();
    sortable = Sortable.create(slidesContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onEnd: updateSlideNumbers
    });
}

function updateSlideNumbers() {
  Array.from(slidesContainer.children).forEach((item, i) => {
    const text = item.dataset.title;
    item.querySelector('span').textContent = `${i + 1}. ${text}`;
  });
}

function renderSlides(raw) {
    const lines = raw
        .split(/\n+/)
        .map(l => l.trim().replace(/^\d+\.\s*/, ''))
        .filter(Boolean);

    if (lines.length === 1) {
        const found = raw.match(/\d+\.\s[^0-9]+?(?=(\d+\.)|$)/g);

        if (found) lines = found.map(s => s.trim().replace(/^\d+\.\s*/, ''));
    }
    slidesContainer.innerHTML = '';
    slidesContainer.classList.remove('hidden');
    placeholderText.style.display = 'none';

    lines.forEach((text, idx) => {
        const item = document.createElement('div');
        item.className = 'slide-item';
        item.id = `slide-${idx + 1}`;

        item.draggable = true;
        item.dataset.title = text;
        const title = document.createElement('span');

        title.textContent = `${idx + 1}. ${text}`;
        const dots = document.createElement('i');
        dots.className = 'fa-solid fa-ellipsis';

        item.appendChild(title);
        item.appendChild(dots);
        slidesContainer.appendChild(item);
    });
    enableDragging();
}

showStep(0);
