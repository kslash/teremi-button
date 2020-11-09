
(() => {
    const app = Vue.createApp({
        data() {
            return {
                buttons: []
            }
        },
        beforeMount() {
            const self = this;
            fetch('/buttons.json')
                .then(response => response.json())
                .then(data => self.buttons = data);
        },
        methods: {
            play(event, button) {
                const file = button.label;
                new Audio('/sounds/' + file + '.mp3').play();
                event.preventDefault();
                return false;
            }
        }
    });
    app.mount('.buttons');
})();