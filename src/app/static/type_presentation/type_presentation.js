document.addEventListener('DOMContentLoaded', () => {
    const cards   = document.querySelectorAll('.type-card');
    const nextBtn = document.getElementById('nextBtn');

    let selected = 'informational';

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selected = card.querySelector('input').value;
            card.querySelector('input').checked = true;
        });
    });

    nextBtn.addEventListener('click', async () => {
        try {
            const resp = await fetch('/app/set_presentation_type', {
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body   : JSON.stringify({ type: selected })
            });
            if (!resp.ok) throw new Error('bad status');
            window.location.href = '/app/questionnaire';
        } catch (e) {
            alert('Не удалось сохранить выбор. Попробуйте ещё раз.');
            console.error(e);
        }
    });
});
