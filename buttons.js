
(() => {
    const buttons = document.querySelectorAll('button.sound');

    for (let button of buttons) {
        button.addEventListener('click', (event) => {
            const file = button.getAttribute('data-file');
            new Audio('/sounds/' + file + '.mp3').play();
            event.preventDefault();
            return false;
        });
    }
})();