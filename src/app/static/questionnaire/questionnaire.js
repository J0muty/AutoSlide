let steps = Array.from(document.querySelectorAll('.step'));
let backBtn = document.getElementById('backBtn');
let nextBtn = document.getElementById('nextBtn');
let topicInp = document.getElementById('topicInput');
let slidesInput = document.getElementById('slidesInput');
let placeholderText = document.getElementById('placeholderText');
let slidesContainer = document.getElementById('slidesContainer');
let addSlideBtn = document.querySelector('.add-slide-btn');

let current = 0;
let currentLines = [];

function updateNextBtnState() {
    const onStructureStep = current === 3;
    const hasStructure = currentLines.length > 0;
    if (onStructureStep && !hasStructure) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
    }
}

function showStep(index) {
    steps[current].classList.remove('active');
    current = index;
    steps[current].classList.add('active');
    backBtn.style.visibility = 'visible';
    nextBtn.textContent = current === steps.length - 1 ? 'Готово' : 'Далее';
    addSlideBtn.style.display = current === 3 ? 'flex' : 'none';
    updateNextBtnState();
}

backBtn.addEventListener('click', () => {
    if (current === 0) {
        window.location.href = '/app/type_presentation';
        return;
    }
    showStep(current - 1);
});

nextBtn.addEventListener('click', async () => {
    if (current === 0 && !topicInp.value.trim()) {
        showNotification('error', 'Пожалуйста, введите тему презентации', 4000);
        return;
    }
    if (current === 1) {
        let slides = +slidesInput.value;
        if (!slides || slides < 1) {
            showNotification('error', 'Введите корректное количество слайдов (минимум 1)', 4000);
            return;
        }
    }
    if (current === 2) {
        let payload = {
            topic: topicInp.value.trim(),
            slides: +slidesInput.value,
            lang: document.querySelector('input[name="lang"]:checked').value
        };
        updateNextBtnState();
        showStep(3);
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
        placeholderText.style.display = 'none';
        document.getElementById('loader').classList.remove('hidden');
        slidesContainer.classList.add('hidden');
        try {
            let res = await fetch('/app/generate_structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Ошибка ответа сервера');
            let { structure } = await res.json();
            renderSlides(structure);
        } catch (err) {
            document.getElementById('loader').classList.add('hidden');
            placeholderText.textContent = 'Не удалось сгенерировать структуру: ' + err.message;
            placeholderText.style.display = 'block';
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }
        return;
    }
    if (current < steps.length - 1) showStep(current + 1);
});

showStep(0);
