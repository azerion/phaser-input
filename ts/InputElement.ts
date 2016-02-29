module Fabrique {

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

        constructor(id: string, type: InputType = InputType.text, value: string = '') {
            this.id = id;
            this.type = type;

            this.element = document.createElement('input');

            this.element.id = id;
            this.element.style.position = 'absolute';
            this.element.style.top = (-100).toString() + 'px';
            this.element.style.left = (-100).toString() + 'px';
            this.element.value = this.value;
            this.element.type = InputType[type];

            document.body.appendChild(this.element);
        }

        public addKeyUpListener(callback: () => void): void {
            this.callback = callback;
            document.addEventListener('keyup', this.callback);
        }

        public removeEventListener(): void {
            document.body.removeChild(this.element);

            document.removeEventListener('keyup', this.callback);
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
        }
    }
}