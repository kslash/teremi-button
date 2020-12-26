
(() => {

    class Playlist {
        constructor() {
            this.queue = Promise.resolve();
            this.mode = 'pause';
        }

        get mode() { return this._mode; }

        set mode(mode) {
            this._mode = mode;
            switch (mode) {
                case 'later':
                    this.play = this.playLater;
                    break;
                case 'immediately':
                    this.play = this.playImmediately;
                    break;
                case 'pause':
                default:
                    this.play = this.playWithPause;
                    break;
            }
            this.queue = Promise.resolve();
        }

        playWithPause(audio) {
            this.queue = this.queue.then((last) => {
                if (last) {
                    console.log('%s, paused:%s, ended:%s', last.src, last.paused, last.ended);
                }

                if (!last || last.ended || last.paused) {
                    audio.play();
                    return Promise.resolve(audio);
                }

                const p = new Promise((resolve) => {
                    last.addEventListener('pause', (event) => {
                        audio.play();
                        resolve(audio);
                    }, { once: true })
                });
                last.pause();
                return p;
            });
        }
        playLater(audio) {
            this.queue = this.queue.then((last) => {
                if (!last || last.ended) {
                    audio.play();
                    return Promise.resolve(audio);
                }

                return new Promise((resolve) => {
                    last.addEventListener('ended', (event) => {
                        audio.play();
                        resolve(audio);
                    }, { once: true })
                });
            });
        }
        playImmediately(audio) {
            this.queue = this.queue.then((last) => {
                audio.play();
                return Promise.resolve(audio);
            });
        }

    }

    const app = Vue.createApp({
        data() {
            return {
                buttons: [],
                keys: {},
                playlist: new Playlist(),
            }
        },
        beforeMount() {
            fetch('/buttons.json')
                .then(response => response.json())
                .then(data => this.buttons = data)
                .then(() => {
                    this.buttons.filter((button) => button.key).forEach((button) => this.keys[button.key] = button);
                });
            document.addEventListener('keydown', this.keydown)
        },
        methods: {
            play(event, button) {
                const file = button.label;
                this.playlist.play(new Audio(`/sounds/${file}.mp3`));
                event.preventDefault();
                return false;
            },
            keydown(event) {
                if(this.keys[event.key]) {
                    this.play(event, this.keys[event.key]);
                }
            }
        }
    });
    app.mount('#app');
})();