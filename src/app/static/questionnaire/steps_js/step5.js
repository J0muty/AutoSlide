document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.image-style-option');
    const preview = document.querySelector('.image-style-preview img');

    options.forEach((option) => {
        option.addEventListener('click', () => {
            options.forEach((el) => el.classList.remove('active'));
            option.classList.add('active');
        });
    });
});
