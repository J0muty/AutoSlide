document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const btn = card.querySelector(".card__btn");
        if (btn) {
            btn.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
            });
        }
    });

    const tabs = document.querySelectorAll(".tab");
    const panes = document.querySelectorAll(".tab-content");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            panes.forEach(p => p.classList.remove("active"));
            document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
        });
    });

    const slidesInput = document.getElementById("builder-slides");
    const usersInput = document.getElementById("builder-users");
    const slidesVal = document.getElementById("builder-slides-val");
    const usersVal = document.getElementById("builder-users-val");
    const builderTotal = document.getElementById("builder-total");

    function updateBuilder() {
        const slides = parseInt(slidesInput.value, 10);
        const users = parseInt(usersInput.value, 10);
        slidesVal.textContent = slides;
        usersVal.textContent = users;
        const price = Math.round(slides * 5.66 + users * 100);
        builderTotal.textContent = price;
    }

    if (slidesInput) {
        slidesInput.addEventListener("input", updateBuilder);
        usersInput.addEventListener("input", updateBuilder);
        updateBuilder();
    }

    const singlePages = document.getElementById("single-pages");
    const singlePagesVal = document.getElementById("single-pages-val");
    const singleTotal = document.getElementById("single-total");
    function updateSingle() {
        const pages = parseInt(singlePages.value, 10);
        singlePagesVal.textContent = pages;
        singleTotal.textContent = pages * 39;
    }
    if (singlePages) {
        singlePages.addEventListener("input", updateSingle);
        updateSingle();
    }
});
