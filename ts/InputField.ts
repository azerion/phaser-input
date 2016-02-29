module Fabrique {
    import Text = Phaser.Text;
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
        cursorColor?: string;
        placeHolderColor?: string;
        type?: InputType;
        min?: string;
        max?: string;
        textAlign?: string;
    }

    export class InputField extends Phaser.Sprite {
        private placeHolder:Phaser.Text = null;

        private box:Phaser.Graphics = null;

        private textMask: TextMask;

        private focus:boolean = false;

        private cursor:Phaser.Text;

        private text:Phaser.Text;

        private offscreenText: Phaser.Text;

        public value:string = '';

        private inputOptions: InputOptions;

        private domElement: InputElement;

        constructor(game:Phaser.Game, x:number, y:number, inputOptions:InputOptions = {}) {
            super(game, x, y);

            //Parse the options
            this.inputOptions = inputOptions;
            this.inputOptions.width = inputOptions.width || 150;
            this.inputOptions.padding = inputOptions.padding || 0;
            this.inputOptions.textAlign = inputOptions.textAlign || 'left';
            this.inputOptions.type = inputOptions.type || InputType.text;
            this.inputOptions.borderRadius = inputOptions.borderRadius || 0;
            this.inputOptions.height = inputOptions.height || 14;
            this.inputOptions.fillAlpha = inputOptions.fillAlpha || 1;

            //create the input box
            this.box = new InputBox(this.game, inputOptions);
            this.setTexture(this.box.generateTexture());

            //create the mask that will be used for the texts
            this.textMask = new TextMask(this.game, inputOptions);
            this.addChild(this.textMask);

            //Create the hidden dom elements
            this.domElement = new InputElement('phaser-input-' + (Math.random() * 10000 | 0).toString(), this.inputOptions.type, this.value);
            this.domElement.setMax(this.inputOptions.max, this.inputOptions.min);

            if (inputOptions.placeHolder && inputOptions.placeHolder.length > 0) {
                this.placeHolder = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding, inputOptions.placeHolder, <Phaser.PhaserTextStyle>{
                    font: inputOptions.font || '14px Arial',
                    fontWeight: inputOptions.fontWeight || 'normal',
                    fill: inputOptions.placeHolderColor || '#bfbebd'
                });
                this.placeHolder.mask = this.textMask;
                this.addChild(this.placeHolder);
            }

            this.cursor = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding - 2, '|', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.cursorColor || '#000000'
            });
            this.cursor.visible = false;
            this.addChild(this.cursor);

            this.text = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding, '', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            this.text.mask = this.textMask;
            this.addChild(this.text);

            this.offscreenText = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding, '', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });

            switch (this.inputOptions.textAlign) {
                case 'left':
                    this.text.anchor.set(0, 0);
                    this.cursor.x = this.inputOptions.padding + this.getCaretPosition();
                    break;
                case 'center':
                    this.text.anchor.set(0.5, 0);
                    this.text.x += this.inputOptions.width / 2;
                    this.cursor.x = this.inputOptions.padding + this.inputOptions.width / 2  - this.text.width / 2  + this.getCaretPosition();
                    break;
                case 'right':
                    this.text.anchor.set(1, 0);
                    this.text.x += this.inputOptions.width;
                    this.cursor.x = this.inputOptions.padding + this.inputOptions.width;
                    break;
            }

            this.inputEnabled = true;
            this.input.useHandCursor = true;

            this.game.input.onDown.add(this.checkDown, this);
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
                if (null !== this.placeHolder) {
                    this.placeHolder.visible = false;
                }

                this.startFocus();
            } else {
                if (this.focus === true) {
                    this.endFocus()
                }
            }
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
            this.domElement.removeEventListener();

            this.focus = false;
            if (this.value.length === 0 && null !== this.placeHolder) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;
        }

        private startFocus() {
            this.domElement.addKeyUpListener(this.keyListener.bind(this));

            if (this.game.device.desktop) {
                //Timeout is a chrome hack
                setTimeout(() => {
                    this.domElement.focus();
                }, 0);
            } else {
                this.domElement.focus();
            }

        }

        /**
         * Update the text value in the box, and make sure the cursor is positioned correctly
         */
        private updateText()
        {
            var text: string = '';
            if (this.inputOptions.type === InputType.password) {
                for (let i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            }else if (this.inputOptions.type === InputType.number) {
                var val = parseInt(this.value);
                if (val < parseInt(this.inputOptions.min)) {
                    text = this.inputOptions.min;
                } else if (val > parseInt(this.inputOptions.max)) {
                    text = this.inputOptions.max;
                } else {
                    text = this.value;
                }
            } else {
                text = this.value;
            }

            this.text.setText(text);

            if (this.text.width > this.inputOptions.width) {
                this.text.anchor.x = 1;
                this.text.x = this.inputOptions.padding + this.inputOptions.width;
            } else {
                switch (this.inputOptions.textAlign) {
                    case 'left':
                        this.text.anchor.set(0, 0);
                        this.text.x = this.inputOptions.padding;
                        break;
                    case 'center':
                        this.text.anchor.set(0.5, 0);
                        this.text.x = this.inputOptions.padding + this.inputOptions.width / 2;
                        break;
                    case 'right':
                        this.text.anchor.set(1, 0);
                        this.text.x = this.inputOptions.padding + this.inputOptions.width;
                        break;
                }
            }
        }

        /**
         * Updates the position of the caret in the phaser input field
         */
        private updateCursor() {
            if (this.text.width > this.inputOptions.width || this.inputOptions.textAlign === 'right') {
                this.cursor.x = this.inputOptions.padding + this.inputOptions.width;
            } else {
                switch (this.inputOptions.textAlign) {
                    case 'left':
                        this.cursor.x = this.inputOptions.padding + this.getCaretPosition();
                        break;
                    case 'center':
                        this.cursor.x = this.inputOptions.padding + this.inputOptions.width / 2 - this.text.width / 2 + this.getCaretPosition();
                        break;
                }
            }
        }

        /**
         * Fetches the carrot position from the dom element. This one changes when you use the keyboard to navigate the element
         *
         * @returns {number}
         */
        private getCaretPosition() {
            var caretPosition: number = this.domElement.getCaretPosition();
            if (-1 === caretPosition) {
                return this.text.width;
            }

            var text = this.value;
            if (this.inputOptions.type === InputType.password) {
                text = '';
                for (let i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            }

            this.offscreenText.setText(text.slice(0, caretPosition));

            return this.offscreenText.width;
        }

        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
        private keyListener()
        {
            this.value = this.domElement.value;

            this.updateText();
            this.updateCursor();
        }

        /**
         * We overwrite the destroy method because we want to delete the (hidden) dom element when the inputField was removed
         */
        public destroy() {
            this.domElement.destroy();

            super.destroy();
        }

        /**
         * Resets the text to an empty value
         */
        public resetText() {
            this.value = "";
            this.domElement.value = this.value;
            this.updateText();
            this.updateCursor();
            this.endFocus();
        }
    }
}
