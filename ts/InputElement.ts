module PhaserInput {

    export enum InputType {
        text,
        password,
        number
    }

    export class InputElement {
        private element: HTMLInputElement;

        private callback: () => void;

        private type: InputType;

        private id: string;

        private game: Phaser.Game;

        public focusIn: Phaser.Signal = new Phaser.Signal();

        public focusOut: Phaser.Signal = new Phaser.Signal();

        constructor(game: Phaser.Game, id: string, type: InputType = InputType.text, value: string = '') {
            this.id = id;
            this.type = type;
            this.game = game;

            let canvasTopX: number = this.game.canvas.getBoundingClientRect().top + document.body.scrollTop;

            this.element = document.createElement('input');

            this.element.id = id;
            this.element.style.position = 'absolute';
            this.element.style.top = canvasTopX + 'px';
            this.element.style.left = (-40).toString() + 'px';
            this.element.style.width = (10).toString() + 'px';
            this.element.style.height = (10).toString() + 'px';
            this.element.style.border = '0px';
            this.element.value = this.value;
            this.element.type = InputType[type];


            this.element.addEventListener('focusin', (): void => {
                this.focusIn.dispatch();
            });
            this.element.addEventListener('focusout', (): void => {
                this.focusOut.dispatch()
            });

            document.body.appendChild(this.element);
        }

        public addKeyUpListener(callback: () => void): void {
            this.callback = callback;
            document.addEventListener('keyup', this.callback);
        }

        /**
         * Captures the keyboard event on keydown, used to prevent it going from input field to sprite
         **/
        public blockKeyDownEvents(): void {
            document.addEventListener('keydown', this.preventKeyPropagation);
        }

        /**
        * To prevent bubbling of keyboard event from input field to sprite
        **/
        private preventKeyPropagation(evt: KeyboardEvent): void{
            if(evt.stopPropagation){
                evt.stopPropagation();
            } else {
                //for IE < 9
                event.cancelBubble = true;
            }
        }

        /**
         * Remove listener that captures keydown keyboard events
         **/
        public unblockKeyDownEvents(): void {
            document.removeEventListener('keydown', this.preventKeyPropagation);
        }

        public removeEventListener(): void {
            document.removeEventListener('keyup', this.callback);
        }

        public destroy() {
            document.body.removeChild(this.element);
        }

        public setMax(max: string, min?: string) {
            if (max === undefined) {
                return;
            }

            if (this.type === InputType.text || this.type === InputType.password) {
                this.element.maxLength = parseInt(max, 10);
            } else if (this.type === InputType.number) {
                this.element.max = max;
                if (min === undefined) {
                    return;
                }

                this.element.min = min;
            }
        }

        get value(): string {
            return this.element.value;
        }

        set value(value: string) {
            this.element.value = value;
        }

        public focus(): void {
            this.element.focus();
            if (!this.game.device.desktop && this.game.device.chrome) {
                let originalWidth = window.innerWidth,
                    originalHeight = window.innerHeight;

                let kbAppeared: boolean = false;
                let interval: number = setInterval((): void => {
                    if (originalWidth > window.innerWidth || originalHeight > window.innerHeight) {
                        kbAppeared = true;
                    }

                    if (kbAppeared && originalWidth === window.innerWidth && originalHeight === window.innerHeight) {
                        this.focusOut.dispatch();
                        clearInterval(interval);
                    }
                }, 50);
            }
        }

        public blur(): void {
            this.element.blur();
        }

        get hasSelection () {
            if (this.type === InputType.number) {
                return false;
            }

            return this.element.selectionStart !== this.element.selectionEnd;
        }

        get caretStart() {
            return this.element.selectionEnd;
        }

        get caretEnd() {
            return this.element.selectionStart;
        }

        public getCaretPosition() {
            if (this.type === InputType.number) {
                return -1;
            }
            return this.element.selectionStart;
        }

        public setCaretPosition(pos: number) {
            if (this.type === InputType.number) {
                return ;
            }
            this.element.setSelectionRange(pos, pos);
        }
    }
}