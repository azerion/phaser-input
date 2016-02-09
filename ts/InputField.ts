module Fabrique {
    export interface InputOptions extends Phaser.PhaserTextStyle {
        x?: number;
        y?: number;
        placeHolder?: string;
        width?: number;
        height?: number;
        padding?: number;
        borderWidth?: number;
        borderColor?: string;
        borderRadius?: number;
        boxShadow?: string;
        innerShadow?: string;
        placeHolderColor?: string;
    }

    export class InputField extends Phaser.Sprite {
        public placeHolder:Phaser.Text = null;

        public box:Phaser.Graphics = null;

        private focus:boolean = false;

        private cursor:Phaser.Text;

        public text:Phaser.Text;

        private value:string = '';

        private registered: boolean;

        private shift: Phaser.Key;

        private padding: number;

        private callback: () => void

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

            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.game.input.onDown.add(this.checkDown, this)
        }

        private createBox(inputOptions:InputOptions) {
            var bgColor:number = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff;
            var borderColor:number = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595;
            var height = inputOptions.height || 14;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            height = this.padding * 2 + height;
            var width = inputOptions.width || 150;
            width = this.padding * 2 + width;

            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, 1)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, 1)
                .drawRoundedRect(0, 0, width, height, inputOptions.borderRadius || 3);

            this.addChild(this.box);
        }

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

        private createDomElement()
        {
            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'hack';
            input.style.position = 'absolute';
            input.style.top = (-100).toString() + 'px';
            input.style.left = (-100).toString() + 'px';
            input.value = this.value;
            document.body.appendChild(input);
            //chrome/safari hack/bugfix
            setTimeout(() => {
                input.focus();
            }, 0);


            this.callback = () => this.keyListener()
            document.addEventListener('keyup', this.callback);
        }

        private removeDomElement()
        {
            var input = document.getElementById('hack');
            document.body.removeChild(input);

            document.removeEventListener('keyup', this.callback);
        }

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

        private onKeyPress(key: Phaser.Key) {
            if (!this.focus) {
                return;
            }

            var s = String.fromCharCode(key.keyCode);
            this.value += (this.shift.isDown) ? s : s.toLowerCase();

            this.updateText();
        }

        private endFocus() {
            this.focus = false;
            if (this.value.length === 0) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;

            this.removeDomElement();
        }

        private updateText()
        {
            this.text.setText(this.value);
            this.cursor.x = this.text.width + this.padding;
        }

        private keyListener()
        {
            this.value = (<HTMLInputElement>document.getElementById('hack')).value;

            this.updateText();
        }
    }
}
