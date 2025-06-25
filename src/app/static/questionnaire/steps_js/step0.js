document.querySelectorAll('.example').forEach(ex => {
    ex.addEventListener('click', () => {
        document.getElementById('topicInput').value = ex.textContent;
    });
});
