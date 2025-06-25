document.addEventListener('DOMContentLoaded', () => {
    const styleBtns = document.querySelectorAll('.step[data-step="4"] .style-btn');
    styleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            styleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const themeCards = document.querySelectorAll('.step[data-step="4"] .theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
});
