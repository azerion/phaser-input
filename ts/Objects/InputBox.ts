module PhaserInput {
    export class InputBox extends Phaser.Graphics {
        private bgColor: number;
        private borderRadius: number;
        private borderColor: number;
        private borderWidth: number;
        private boxAlpha: number;
        private boxHeight: number;
        private padding: number;
        private boxWidth: number;

        constructor(game: Phaser.Game, inputOptions: InputOptions) {
            super(game, 0, 0);
            
            this.bgColor = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff;
            this.borderRadius = inputOptions.borderRadius || 0;
            this.borderWidth = inputOptions.borderWidth || 1;
            this.borderColor = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595;
            this.boxAlpha = inputOptions.fillAlpha;
            this.padding = inputOptions.padding;

            var height: number = inputOptions.height;
            var width: number = inputOptions.width;

            var height: number;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }

            this.boxHeight = this.padding * 2 + height;
            var width = inputOptions.width;
            this.boxWidth = this.padding * 2 + width;

            this.drawBox();
        }

        public resize(newWidth: number): void {
            this.boxWidth = this.padding * 2 + newWidth;

            this.drawBox();
        }

        private drawBox(): void {
            this.clear()
                .beginFill(this.bgColor, this.boxAlpha)
                .lineStyle(this.borderWidth, this.borderColor, this.boxAlpha);

            if (this.borderRadius > 0) {
                this.drawRoundedRect(0, 0, this.boxWidth, this.boxHeight, this.borderRadius);
            } else {
                this.drawRect(0, 0, this.boxWidth, this.boxHeight);
            }
        }
    }
}