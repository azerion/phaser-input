module PhaserInput {

    export enum InputType {
        text,
        password,
        number
    }

    export class InputElement {
        private element: HTMLInputElement;

        private keyUpCallback: () => void;

        private inputChangeCallback: () => void;

        private type: InputType;

        private id: string;

        private game: Phaser.Game;

        private focusIn: Phaser.Signal;

        private focusOut: Phaser.Signal;

        constructor(game: Phaser.Game, id: string, type: InputType = InputType.text, value: string = '', focusIn?: Phaser.Signal, focusOut?: Phaser.Signal) {
            this.id = id;
            this.type = type;
            this.game = game;
            this.focusIn = focusIn;
            this.focusOut = focusOut;

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
                if (this.focusIn instanceof Phaser.Signal) {
                    this.focusIn.dispatch();
                }
            });
            this.element.addEventListener('focusout', (): void => {
                if (this.focusOut instanceof Phaser.Signal) {
                    this.focusOut.dispatch();
                }
            });

            document.body.appendChild(this.element);
        }

        public addKeyUpListener(callback: () => void): void {
            this.keyUpCallback = callback;
            document.addEventListener('keyup', this.keyUpCallback);
            this.element.addEventListener('input', this.keyUpCallback);

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
            document.removeEventListener('keyup', this.keyUpCallback);
            this.element.removeEventListener('input', this.keyUpCallback);
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
                        if (this.focusOut instanceof Phaser.Signal) {
                            this.focusOut.dispatch();
                        }
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