(function() {
    function passScrollbarWidth() {
        const fullWindow = window.innerWidth;
        const noScroll = document.querySelector('html').getBoundingClientRect().width;
        const scrollBarWidth = parseInt((fullWindow - noScroll), 10) + 'px';
        const root = document.documentElement;
        root.style.setProperty('--scrollbar', scrollBarWidth);
    }
    window.addEventListener('DOMContentLoaded', passScrollbarWidth);
})()