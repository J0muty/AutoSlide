document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const userToggle = document.getElementById('userToggle');
    const userMenuContainer = document.getElementById('userMenuContainer');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    userToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!userMenuContainer.contains(e.target)) {
            userMenuContainer.classList.remove('open');
        }
    });
});
