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

        private textMask: Phaser.Graphics;

        private focus:boolean = false;

        private cursor:Phaser.Text;

        private text:Phaser.Text;

        private offscreenText: Phaser.Text;

        public value:string = '';

        private inputOptions: InputOptions;

        private domElement: InputElement;

        constructor(game:Phaser.Game, x:number, y:number, inputOptions:InputOptions = {}) {
            super(game, x, y);

            this.inputOptions = inputOptions;
            this.inputOptions.width = inputOptions.width || 150;
            this.inputOptions.padding = inputOptions.padding || 0;
            this.inputOptions.textAlign = inputOptions.textAlign || 'left';
            this.inputOptions.type = inputOptions.type || InputType.text;

            this.createBox();
            this.createTextMask();
            this.createDomElement();

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

        private createTextMask() {
            var borderRadius = this.inputOptions.borderRadius || 0,
                height = this.inputOptions.height || 14;

            if (this.inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(this.inputOptions.font.substr(0, this.inputOptions.font.indexOf('px')), 10), height);
            }
            var width = this.inputOptions.width;


            this.textMask = new Phaser.Graphics(this.game, this.inputOptions.padding, this.inputOptions.padding);
            this.textMask.beginFill(0x000000);

            if (borderRadius > 0) {
                this.textMask.drawRoundedRect(0, 0, width, height, borderRadius);
            } else {
                this.textMask.drawRect(0, 0, width, height);
            }

            this.addChild(this.textMask);
        }

        /**
         * Creates the nice box for the input field
         *
         * @param inputOptions
         */
        private createBox() {
            var bgColor:number = (this.inputOptions.backgroundColor) ? parseInt(this.inputOptions.backgroundColor.slice(1), 16) : 0xffffff,
                borderRadius = this.inputOptions.borderRadius || 0,
                borderColor:number = (this.inputOptions.borderColor) ? parseInt(this.inputOptions.borderColor.slice(1), 16) : 0x959595,
                alpha: number = (this.inputOptions.fillAlpha !== undefined) ? this.inputOptions.fillAlpha : 1,
                height = this.inputOptions.height || 14;

            if (this.inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(this.inputOptions.font.substr(0, this.inputOptions.font.indexOf('px')), 10), height);
            }

            height = this.inputOptions.padding * 2 + height;
            var width = this.inputOptions.width;
            width = this.inputOptions.padding * 2 + width;


            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, alpha)
                .lineStyle(this.inputOptions.borderWidth || 1, borderColor, alpha);

            if (borderRadius > 0) {
                this.box.drawRoundedRect(0, 0, width, height, borderRadius);
            } else {
                this.box.drawRect(0, 0, width, height);
            }


            this.setTexture(this.box.generateTexture());
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
         * Creates a hidden input field, makes sure focus is added to it.
         * This is all to ensure mobile keyboard are also opened
         *
         * And last, but not least, we register an event handler
         */
        private createDomElement()
        {
            this.domElement = new InputElement('phaser-input-' + (Math.random() * 10000 | 0).toString(), this.inputOptions.type, this.value);
            this.domElement.setMax(this.inputOptions.max, this.inputOptions.min);
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
            if (this.type === InputType.password) {
                for (let i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            }else if (this.type === InputType.number) {
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

        private getCaretPosition() {
            var caretPosition: number = this.domElement.getCaretPosition();

            if (-1 === caretPosition) {
                return this.text.width;
            }

            this.offscreenText.setText(this.value.slice(0, caretPosition));

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
