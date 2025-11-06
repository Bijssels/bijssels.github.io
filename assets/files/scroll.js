function adjustScroll() {
    const outer = document.querySelector('.box-outer');
    if (!outer) return;
    if (outer.offsetHeight > window.innerHeight) {
        document.body.style.overflowY = 'auto';
    } else {
        document.body.style.overflowY = 'hidden';
    }
}

window.addEventListener('load', adjustScroll);
window.addEventListener('resize', adjustScroll);