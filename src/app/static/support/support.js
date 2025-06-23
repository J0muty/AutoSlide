document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".support-form");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Support form submitted");
    });
});
