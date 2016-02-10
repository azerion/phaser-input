module Fabrique {
    export interface InputOptions extends Phaser.PhaserTextStyle {
        x?: number;
        y?: number;
        placeHolder?: string;
        fillAlpha?: number;
        width?: number;
        height?: number;
        padding?: number;
        borderWidth?: number;
        borderColor?: string;
        borderRadius?: number;
        placeHolderColor?: string;
        type?: InputType;
    }

    export enum InputType {
        text,
        password
    }

    export class InputField extends Phaser.Sprite {
        public placeHolder:Phaser.Text = null;

        public box:Phaser.Graphics = null;

        private focus:boolean = false;

        private cursor:Phaser.Text;

        public text:Phaser.Text;

        public type: InputType = InputType.text;

        private value:string = '';

        private registered: boolean;

        private shift: Phaser.Key;

        private padding: number;

        private callback: () => void;

        private id: string = 'phaser-input-' + (Math.random() * 10000 | 0).toString();

        constructor(game:Phaser.Game, x:number, y:number, inputOptions:InputOptions) {
            super(game, x, y);

            this.padding = inputOptions.padding || 0;
            this.createBox(inputOptions);

            if (inputOptions.placeHolder && inputOptions.placeHolder.length > 0) {
                this.placeHolder = new Phaser.Text(game, this.padding, this.padding, inputOptions.placeHolder, <Phaser.PhaserTextStyle>{
                    font: inputOptions.font || '14px Arial',
                    fontWeight: inputOptions.fontWeight || 'normal',
                    fill: inputOptions.placeHolderColor || '#bfbebd'
                });
                this.addChild(this.placeHolder);
            }

            this.cursor = new Phaser.Text(game, this.padding, this.padding - 2, '|', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            this.cursor.visible = false;
            this.addChild(this.cursor);

            this.text = new Phaser.Text(game, this.padding, this.padding, '', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.placeHolderColor || '#000000'
            });
            this.addChild(this.text);

            if (inputOptions.type) {
                this.type = inputOptions.type
            }

            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.game.input.onDown.add(this.checkDown, this)
        }

        private createBox(inputOptions:InputOptions) {
            var bgColor:number = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff;
            var borderColor:number = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595;
            var alpha: number = (inputOptions.fillAlpha !== undefined) ? inputOptions.fillAlpha : 1;
            var height = inputOptions.height || 14;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            height = this.padding * 2 + height;
            var width = inputOptions.width || 150;
            width = this.padding * 2 + width;

            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, alpha)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, alpha)
                .drawRoundedRect(0, 0, width, height, inputOptions.borderRadius || 3);

            this.addChild(this.box);
        }

        /**
         * This is a generic input down handler for the game.
         * if the input object is clicked, we gain focus on it and create the dom element
         *
         * If there was focus on the element previously, but clicked outside of it, the element will loose focus
         * and no keyboard events will be registered anymore
         *
         * @param e Phaser.Pointer
         */
        private checkDown(e: Phaser.Pointer): void
        {
            if (this.input.checkPointerOver(e)) {
                this.focus = true;
                this.placeHolder.visible = false;

                this.createDomElement()
            } else {
                if (this.focus === true) {
                    this.endFocus()
                }
            }
        }

        /**
         * Creates a hidden input field, makes sure focus is added to it.
         * This is all to ensure mobile keyboard are also opened
         *
         * And last, but not least, we register an event handler
         */
        private createDomElement()
        {
            var input:HTMLInputElement = <HTMLInputElement>document.getElementById(this.id);
            var created: boolean = false;

            if (null === input) {
                input = document.createElement('input');
                created = true;
            }

            input.id = this.id;
            //input.id = 'hack';
            input.style.position = 'absolute';
            input.style.top = (-100).toString() + 'px';
            input.style.left = (-100).toString() + 'px';
            input.value = this.value;

            if (this.type === InputType.password) {
                input.type = 'password';
            } else {
                input.type = 'text';
            }

            if (created) {
                document.body.appendChild(input);
            }

            //chrome/safari hack/bugfix
            setTimeout(() => {
                input.focus();
            }, 10);


            this.callback = () => this.keyListener()
            document.addEventListener('keyup', this.callback);
        }

        /**
         * Removes the hidden input field and the key eventlistener
         */
        private removeDomElement()
        {
            var input = document.getElementById(this.id);
            document.body.removeChild(input);

            document.removeEventListener('keyup', this.callback);
        }

        /**
         * Update function makes the cursor blink, it uses two private properties to make it toggle
         *
         * @returns {number}
         */
        private blink:boolean = true;
        private cnt: number = 0;
        public update()
        {
            if (!this.focus) {
                return;
            }

            if (this.cnt !== 30) {
                return this.cnt++;
            }

            this.cursor.visible = this.blink;
            this.blink = !this.blink;
            this.cnt = 0;
        }

        /**
         * Focus is lost on the input element, we disable the cursor and remove the hidden input element
         */
        private endFocus() {
            this.focus = false;
            if (this.value.length === 0) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;

            this.removeDomElement();
        }

        /**
         * Update the text value in the box, and make sure the cursor is positioned correctly
         */
        private updateText()
        {
            var text: string = '';
            if (this.type === InputType.password) {
                for(let i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            } else {
                text = this.value;
            }
            this.text.setText(text);
            this.cursor.x = this.text.width + this.padding;
        }

        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
        private keyListener()
        {
            this.value = (<HTMLInputElement>document.getElementById(this.id)).value;

            this.updateText();
        }
    }
}
