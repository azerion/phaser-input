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
        selectionColor?: string;
        zoom?: boolean;
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

        private selection: SelectionHighlight;

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
            this.inputOptions.fillAlpha = (inputOptions.fillAlpha === undefined) ? 1 : inputOptions.fillAlpha;
            this.inputOptions.selectionColor = inputOptions.selectionColor || 'rgba(179, 212, 253, 0.8)';
            this.inputOptions.zoom = (!game.device.desktop) ? inputOptions.zoom || false : false;

            //create the input box
            this.box = new InputBox(this.game, inputOptions);
            this.setTexture(this.box.generateTexture());

            //create the mask that will be used for the texts
            this.textMask = new TextMask(this.game, inputOptions);
            this.addChild(this.textMask);

            //Create the hidden dom elements
            this.domElement = new InputElement(this.game, 'phaser-input-' + (Math.random() * 10000 | 0).toString(), this.inputOptions.type, this.value);
            this.domElement.setMax(this.inputOptions.max, this.inputOptions.min);

            this.selection = new SelectionHighlight(this.game, this.inputOptions);
            this.addChild(this.selection);

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
            this.domElement.focusOut.add((): void => {
                if (Plugins.InputField.KeyboardOpen) {
                    this.endFocus();
                    if (this.inputOptions.zoom) {
                        this.zoomOut();
                    }
                }
            })
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
                if (this.focus) {
                    this.setCaretOnclick(e);
                    return;
                }

                this.focus = true;
                if (null !== this.placeHolder) {
                    this.placeHolder.visible = false;
                }

                this.startFocus();
                if (this.inputOptions.zoom) {
                    this.zoomIn();
                }
            } else {
                if (this.focus === true) {
                    this.endFocus();
                    if (this.inputOptions.zoom) {
                        this.zoomOut();
                    }
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

            if (this.game.device.desktop) {
                //Timeout is a chrome hack
                setTimeout(() => {
                    this.domElement.blur();
                }, 0);
            } else {
                this.domElement.blur();
            }

            if (!this.game.device.desktop) {
                Plugins.InputField.KeyboardOpen = false;
            }
        }

        /**
         *
         */
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

            if (!this.game.device.desktop) {
                Plugins.InputField.KeyboardOpen = true;
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
         * Set the caret when a click was made in the input field
         *
         * @param e
         */
        private setCaretOnclick(e: Phaser.Pointer) {
            var localX: number = (this.text.toLocal(new PIXI.Point(e.x, e.y), this.game.stage)).x;
            if (this.inputOptions.textAlign && this.inputOptions.textAlign === 'center') {
                localX += this.text.width / 2;
            }

            var characterWidth: number = this.text.width / this.value.length;
            var index: number  = 0;
            for (let i: number = 0; i < this.value.length; i++) {
                if (localX >= i * characterWidth && localX <= (i + 1) * characterWidth) {
                    index = i;
                    break;
                }
            }

            if (localX > (this.value.length - 1) * characterWidth) {
                index = this.value.length;
            }

            this.startFocus();

            this.domElement.setCaretPosition(index);

            this.updateCursor();
        }

        /**
         * This checks if a select has been made, and if so highlight it with blue
         */
        private updateSelection(): void {
            if (this.domElement.hasSelection) {
                var text = this.value;
                if (this.inputOptions.type === InputType.password) {
                    text = '';
                    for (let i = 0; i < this.value.length; i++) {
                        text += '*';
                    }
                }
                text = text.substring(this.domElement.caretStart, this.domElement.caretEnd);
                this.offscreenText.setText(text);

                this.selection.updateSelection(this.offscreenText.getBounds());

                switch (this.inputOptions.textAlign) {
                    case 'left':
                        this.selection.x = this.inputOptions.padding;
                        break;
                    case 'center':
                        this.selection.x = this.inputOptions.padding + this.inputOptions.width / 2 - this.text.width / 2;
                        break;
                }
            } else {
                this.selection.clear();
            }
        }
        
        private zoomIn(): void {
            if (Plugins.InputField.Zoomed) {
                return;
            }

            let windowScale: number;
            if (window.innerHeight > window.innerWidth) {
                windowScale = this.game.width / (this.width * 1.5);
            } else {
                windowScale = (this.game.width / 2) / (this.width * 1.5);
            }

            let offsetX: number = ((this.game.width - this.width * 1.5) / 2) / windowScale;
            this.game.world.scale.set(windowScale);
            this.game.world.pivot.set(this.x - offsetX, this.y - this.inputOptions.padding * 2);
            Plugins.InputField.Zoomed = true;
        }

        private zoomOut(): void {
            if (!Plugins.InputField.Zoomed) {
                return;
            }

            this.game.world.scale.set(1);
            this.game.world.pivot.set(0, 0);
            Plugins.InputField.Zoomed = false;
        }

        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
        private keyListener(evt: KeyboardEvent)
        {
            this.value = this.domElement.value;

            if (evt.keyCode === 13) {
                this.endFocus();
                return;
            }

            this.updateText();
            this.updateCursor();
            this.updateSelection();
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
