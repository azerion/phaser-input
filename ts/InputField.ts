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

    export class InputField extends Phaser.Sprite
    {
        public static ALLOWED_CHARACTERS: number[] = [
            Phaser.Keyboard.A,
            Phaser.Keyboard.B,
            Phaser.Keyboard.C,
            Phaser.Keyboard.D,
            Phaser.Keyboard.E,
            Phaser.Keyboard.F,
            Phaser.Keyboard.G,
            Phaser.Keyboard.H,
            Phaser.Keyboard.I,
            Phaser.Keyboard.J,
            Phaser.Keyboard.K,
            Phaser.Keyboard.L,
            Phaser.Keyboard.M,
            Phaser.Keyboard.N,
            Phaser.Keyboard.O,
            Phaser.Keyboard.P,
            Phaser.Keyboard.Q,
            Phaser.Keyboard.R,
            Phaser.Keyboard.S,
            Phaser.Keyboard.T,
            Phaser.Keyboard.U,
            Phaser.Keyboard.V,
            Phaser.Keyboard.W,
            Phaser.Keyboard.X,
            Phaser.Keyboard.Y,
            Phaser.Keyboard.Z,
            Phaser.Keyboard.ZERO,
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.THREE,
            Phaser.Keyboard.FOUR,
            Phaser.Keyboard.FIVE,
            Phaser.Keyboard.SIX,
            Phaser.Keyboard.SEVEN,
            Phaser.Keyboard.EIGHT,
            Phaser.Keyboard.NINE,
        ];

        public placeHolder: Phaser.Text = null;

        public box: Phaser.Graphics = null;

        private focus: boolean = false;

        private cursor: Phaser.Text;

        public text: Phaser.Text;

        private value: string = '';

        constructor(game: Phaser.Game, x: number, y: number, inputOptions:InputOptions)
        {
            super(game, x, y);

            this.createBox(inputOptions);

            if (inputOptions.placeHolder && inputOptions.placeHolder.length > 0) {
                console.log(inputOptions);
                this.placeHolder = new Phaser.Text(game, inputOptions.padding || 0, inputOptions.padding || 0, inputOptions.placeHolder, <Phaser.PhaserTextStyle>{
                    font: inputOptions.font || '14px Arial',
                    fontWeight: inputOptions.fontWeight || 'normal',
                    fill: inputOptions.placeHolderColor || '#bfbebd'
                });
                this.addChild(this.placeHolder);
            }

            this.cursor = new Phaser.Text(game, inputOptions.padding || 0, (inputOptions.padding || 0) - 2, '|', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            this.cursor.visible = false;
            this.addChild(this.cursor);

            this.text = new Phaser.Text(game, inputOptions.padding || 0, (inputOptions.padding || 0), '', <Phaser.PhaserTextStyle>{
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.placeHolderColor || '#000000'
            });
            this.addChild(this.text);

            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.game.input.onDown.add(this.checkDown, this)
        }

        private createBox(inputOptions:InputOptions)
        {
            var bgColor: number = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff;
            var borderColor: number = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595;
            var height = inputOptions.height || 14;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            height = (inputOptions.padding) ? inputOptions.padding * 2 + height : height;
            var width = inputOptions.width || 150;
            width = (inputOptions.padding) ? inputOptions.padding * 2 + width : width;

            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, 1)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, 1)
                .drawRoundedRect(0, 0, width, height, inputOptions.borderRadius || 3);

            this.addChild(this.box);
        }

        private checkDown(e: Phaser.Pointer)
        {
            if (this.input.checkPointerOver(e)) {
                this.focus = true;
                this.game.input.keyboard.onDownCallback = () => {
                    this.onKeyPress()
                };
                this.placeHolder.visible = false;
            } else {
                this.focus = false;
                if (this.value.length === 0) {
                    this.placeHolder.visible = true;
                    this.cursor.visible = false;
                }
            }
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

        public onKeyPress() {
            if (!this.focus) {
                return;
            }

            this.value += String.fromCharCode(this.game.input.keyboard.event.keyCode);

            this.text.setText(this.value);

            this.cursor.x = this.text.width;
        }
    }
}
