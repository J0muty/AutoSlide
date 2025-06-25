let sortable;

function enableDragging() {
    if (sortable) sortable.destroy();
    sortable = Sortable.create(slidesContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        draggable: '.slide-item',
        forceFallback: true,
        fallbackOnBody: true,
        touchStartThreshold: 5,
        filter: '.fa-ellipsis',
        preventOnFilter: false,
        onEnd: updateSlideNumbers
    });
}

function setDragging(enabled) {
    if (sortable) sortable.option('disabled', !enabled);
}

function updateSlideNumbers() {
    let titles = [];
    slidesContainer.querySelectorAll('.slide-item').forEach((item, i) => {
        let text = item.dataset.title;
        titles.push(text);
        let span = item.querySelector('span');
        if (span) span.textContent = `${i + 1}. ${text}`;
    });
    currentLines = titles;
    renderSlides(currentLines.join('\n'));
}

function renderSlides(raw) {
    const lines = raw.split(/\n+/).map(l => l.trim().replace(/^\d+\.\s*/, '')).filter(Boolean);
    currentLines = lines;
    slidesContainer.innerHTML = '';
    slidesContainer.classList.remove('hidden');
    placeholderText.style.display = 'none';
    document.getElementById('loader').classList.add('hidden');
    lines.forEach((text, idx) => {
        createSlideItem(text, idx);
        createInsertSlot(idx + 1);
    });
    enableDragging();
    updateNextBtnState();
}

function createInsertSlot(idx) {
    let slot = document.createElement('div');
    slot.className = 'slide-insert';
    slot.dataset.index = idx;
    let btn = document.createElement('div');
    btn.className = 'insert-btn';
    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-plus';
    btn.append(icon);
    slot.append(btn);
    slot.addEventListener('click', () => openInsertModal(idx));
    slidesContainer.append(slot);
}

function openInsertModal(idx, editing = false) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML =
        '<div class="modal-content">' +
        `<h2>${editing ? 'Редактировать заголовок' : 'Заголовок слайда'}</h2>` +
        '<input type="text" id="newSlideTitle" placeholder="Введите текст для заголовка слайда">' +
        '<div class="modal-actions">' +
        '<button class="btn cancel">Отмена</button>' +
        `<button class="btn create">${editing ? 'Сохранить' : 'Создать'}</button>` +
        '</div>' +
        '</div>';
    document.body.append(modal);

    const input = modal.querySelector('#newSlideTitle');
    const create = modal.querySelector('.create');
    const cancel = modal.querySelector('.cancel');

    if (editing) input.value = currentLines[idx] || '';
    input.focus();

    input.addEventListener('input', () => {
        input.value.trim() ? create.classList.add('enabled') : create.classList.remove('enabled');
    });

    modal.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim()) create.click();
    });

    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    cancel.addEventListener('click', () => modal.remove());

    create.addEventListener('click', () => {
        if (!input.value.trim()) return;
        if (editing) currentLines[idx] = input.value.trim();
        else currentLines.splice(idx, 0, input.value.trim());
        modal.remove();
        renderSlides(currentLines.join('\n'));
    });
}

function createSlideItem(text, idx) {
    let item = document.createElement('div');
    item.className = 'slide-item';
    item.id = `slide-${idx + 1}`;
    item.draggable = true;
    item.dataset.title = text;
    let title = document.createElement('span');
    title.textContent = `${idx + 1}. ${text}`;
    let dots = document.createElement('i');
    dots.className = 'fa-solid fa-ellipsis';
    dots.addEventListener('mousedown', e => e.stopPropagation());
    dots.addEventListener('touchstart', e => e.stopPropagation());
    dots.addEventListener('click', e => {
        e.stopPropagation();
        toggleSlideMenu(item, idx);
    });
    item.append(title, dots);
    slidesContainer.append(item);
}

function toggleSlideMenu(item, idx) {
    const existing = item.querySelector('.slide-menu');
    if (existing) {
        existing.remove();
        item.classList.remove('menu-open');
        setDragging(true);
        return;
    }
    closeSlideMenu();
    setDragging(false);
    const menu = document.createElement('div');
    menu.className = 'slide-menu open';
    menu.innerHTML =
        '<button data-act="edit"><i class="fa-solid fa-pen"></i><span>Редактировать</span></button>' +
        '<button data-act="delete"><i class="fa-solid fa-trash"></i><span>Удалить</span></button>';
    item.style.position = 'relative';
    item.append(menu);
    item.classList.add('menu-open');
    item.draggable = false;
    menu.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const act = btn.dataset.act;
        if (act === 'edit') openInsertModal(idx, true);
        if (act === 'delete') {
            currentLines.splice(idx, 1);
            renderSlides(currentLines.join('\n'));
        }
        closeSlideMenu();
    });
    setTimeout(() => { document.addEventListener('click', closeSlideMenu, { once: true }); }, 0);
}

function closeSlideMenu() {
    document.querySelectorAll('.slide-menu').forEach(menu => menu.remove());
    setDragging(true);
}

addSlideBtn.addEventListener('click', () => openInsertModal(currentLines.length));
