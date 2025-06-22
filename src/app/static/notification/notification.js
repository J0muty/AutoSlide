(function(){
    const ICONS={
        success:'<i class="fa-solid fa-circle-check"></i>',
        error:'<i class="fa-solid fa-circle-xmark"></i>',
        warning:'<i class="fa-solid fa-triangle-exclamation"></i>'
    };
    const container=(()=>{let c=document.querySelector('.toast-container');if(!c){c=document.createElement('div');c.className='toast-container';c.setAttribute('aria-live','polite');document.body.appendChild(c);}return c})();
    window.showNotification=function(type='success',msg='',duration=4000){
        const t=document.createElement('div');
        t.className=`toast toast--${type}`;
        t.role='alert';
        t.innerHTML=`<span class="toast__msg">${msg}</span>
                     <button class="toast__close" aria-label="Закрыть"><i class="fa-solid fa-xmark"></i></button>
                     <span class="toast__progress" style="animation-duration:${duration}ms"></span>`;
        container.appendChild(t);

        const closeFn=()=>{t.style.animation=`slideOut var(--slide) forwards`;setTimeout(()=>t.remove(),350);};
        t.querySelector('.toast__close').addEventListener('click',closeFn);

        let startX=null;
        t.addEventListener('pointerdown',e=>{startX=e.clientX;});
        t.addEventListener('pointermove',e=>{
            if(startX===null)return;
            const dx=e.clientX-startX;
            if(dx>50)closeFn();
        });
        t.addEventListener('pointerup',()=>{startX=null;});
        setTimeout(closeFn,duration);
    };
})();
