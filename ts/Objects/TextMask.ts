module PhaserInput {
    export class TextMask extends Phaser.Graphics {
        private maskWidth: number;
        private maskHeight: number;

        constructor(game: Phaser.Game, inputOptions: InputOptions) {
            super(game, inputOptions.padding, inputOptions.padding);

            var height = inputOptions.height;

            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            this.maskWidth = inputOptions.width;
            this.maskHeight = height * 1.3;
            this.drawMask();
        }

        public resize(newWidth: number): void {
            this.maskWidth = newWidth;
            this.drawMask();
        }

        private drawMask(): void {
            this.clear()
                .beginFill(0x000000)
                .drawRect(0, 0, this.maskWidth, this.maskHeight)
                .endFill();
        }
    }
}