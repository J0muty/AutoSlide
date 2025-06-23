document.addEventListener('DOMContentLoaded', () => {
    const placeholders = document.querySelectorAll('.placeholder-card');
    placeholders.forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
        });
    });
});
