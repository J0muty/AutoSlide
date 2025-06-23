document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const userToggle = document.getElementById('userToggle');
    const userMenuContainer = document.getElementById('userMenuContainer');
    const logo = document.querySelector('.sidebar .logo');
    const header = document.querySelector('header');

    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-theme');
        const isDark = document.documentElement.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
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
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== hamburger) {
            sidebar.classList.remove('open');
        }
    });

    function moveLogo() {
        if (window.innerWidth <= 1000) {
            if (!header.querySelector('.logo')) {
                header.insertBefore(logo, hamburger);
            }
        } else {
            if (!sidebar.querySelector('.logo')) {
                sidebar.insertBefore(logo, sidebar.firstChild);
            }
        }
    }

    window.addEventListener('resize', moveLogo);
    moveLogo();
});
