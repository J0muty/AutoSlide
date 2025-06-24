let steps = Array.from(document.querySelectorAll('.step'));
let backBtn = document.getElementById('backBtn');
let nextBtn = document.getElementById('nextBtn');
let topicInp = document.getElementById('topicInput');
let examples = document.querySelectorAll('.example');
let placeholderText = document.getElementById('placeholderText');
let slidesContainer = document.getElementById('slidesContainer');

let current = 0;

function showStep(index){
    steps[current].classList.remove('active');
    current = index;
    steps[current].classList.add('active');
    backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = current === steps.length - 1 ? 'Готово' : 'Далее';
}

examples.forEach(ex => ex.addEventListener('click', () => topicInp.value = ex.textContent));

backBtn.addEventListener('click', () => current > 0 && showStep(current - 1));

nextBtn.addEventListener('click', async () => {
    if(current === 0 && !topicInp.value.trim()){
        showNotification('error','Пожалуйста, введите тему презентации',4000);
        return;
    }
    if(current === 1){
        let slides = +document.getElementById('slidesInput').value;
        if(!slides || slides < 1){
            showNotification('error','Введите корректное количество слайдов (минимум 1)',4000);
            return;
        }
    }
    if(current === 2){
        let payload = {
            topic: topicInp.value.trim(),
            slides: +document.getElementById('slidesInput').value,
            lang: document.querySelector('input[name="lang"]:checked').value
        };
        showStep(3);
        placeholderText.textContent = 'Генерируем структуру, подождите…';
        placeholderText.style.display = 'block';
        slidesContainer.classList.add('hidden');
        try{
            let res = await fetch('/app/generate_structure',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(payload)
            });
            if(!res.ok) throw new Error('Ошибка ответа сервера');
            let {structure} = await res.json();
            renderSlides(structure);
        }catch(err){
            placeholderText.textContent = 'Не удалось сгенерировать структуру: ' + err.message;
        }
        return;
    }
    if(current < steps.length - 1) showStep(current + 1);
});

let sortable;
let currentLines = [];

function enableDragging(){
    if(sortable) sortable.destroy();
    sortable = Sortable.create(slidesContainer,{
        animation:150,
        ghostClass:'sortable-ghost',
        chosenClass:'sortable-chosen',
        dragClass:'sortable-drag',
        draggable:'.slide-item',
        onEnd:updateSlideNumbers
    });
}

function updateSlideNumbers(){
    let titles = [];
    slidesContainer.querySelectorAll('.slide-item').forEach((item,i)=>{
        let text = item.dataset.title;
        titles.push(text);
        let span = item.querySelector('span');
        if(span) span.textContent = `${i + 1}. ${text}`;
    });
    currentLines = titles;
    renderSlides(currentLines.join('\n'));
}

function renderSlides(raw){
    let lines = raw.split(/\n+/).map(l => l.trim().replace(/^\d+\.\s*/,'')).filter(Boolean);
    currentLines = lines;
    slidesContainer.innerHTML = '';
    slidesContainer.classList.remove('hidden');
    placeholderText.style.display = 'none';
    lines.forEach((text,idx)=>{
        createInsertSlot(idx);
        createSlideItem(text,idx);
    });
    createInsertSlot(lines.length);
    enableDragging();
}

function createInsertSlot(idx){
    let slot = document.createElement('div');
    slot.className = 'slide-insert';
    slot.dataset.index = idx;
    let btn = document.createElement('div');
    btn.className = 'insert-btn';
    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-plus';
    btn.append(icon);
    slot.append(btn);
    slot.addEventListener('click',()=>openInsertModal(idx));
    slidesContainer.append(slot);
}

function openInsertModal(idx){
    let modal=document.createElement('div');
    modal.className='modal';
    modal.innerHTML=`
        <div class="modal-content">
            <h2>Заголовок слайда</h2>
            <input type="text" id="newSlideTitle" placeholder="Введите текст для заголовка слайда">
            <div class="modal-actions">
                <button class="btn cancel">Отмена</button>
                <button class="btn create">Создать</button>
            </div>
        </div>`;
    document.body.append(modal);

    let input  = modal.querySelector('#newSlideTitle');
    let create = modal.querySelector('.create');
    let cancel = modal.querySelector('.cancel');

    input.focus();

    input.addEventListener('input',()=>{
        input.value.trim() ? create.classList.add('enabled') : create.classList.remove('enabled');
    });

    modal.addEventListener('keydown',e=>{
        if(e.key==='Enter' && input.value.trim()) create.click();
    });

    modal.addEventListener('click',e=>{
        if(e.target===modal) modal.remove();
    });

    cancel.addEventListener('click',()=> modal.remove());

    create.addEventListener('click',()=>{
        if(!input.value.trim()) return;
        currentLines.splice(idx,0,input.value.trim());
        modal.remove();
        renderSlides(currentLines.join('\n'));
    });
}

function createSlideItem(text,idx){
    let item = document.createElement('div');
    item.className = 'slide-item';
    item.id = `slide-${idx + 1}`;
    item.draggable = true;
    item.dataset.title = text;
    let title = document.createElement('span');
    title.textContent = `${idx + 1}. ${text}`;
    let dots = document.createElement('i');
    dots.className = 'fa-solid fa-ellipsis';
    item.append(title,dots);
    slidesContainer.append(item);
}

showStep(0);
