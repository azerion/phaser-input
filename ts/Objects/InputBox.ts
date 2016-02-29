module Fabrique {
    export class InputBox extends Phaser.Graphics {
        constructor(game: Phaser.Game, inputOptions: InputOptions) {
            super(game, 0, 0);
            
            var bgColor:number = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff,
                borderRadius = inputOptions.borderRadius || 0,
                borderColor:number = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595,
                alpha: number = inputOptions.fillAlpha,
                height = inputOptions.height;

            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }

            height = inputOptions.padding * 2 + height;
            var width = inputOptions.width;
            width = inputOptions.padding * 2 + width;

            this.beginFill(bgColor, alpha)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, alpha);

            if (borderRadius > 0) {
                this.drawRoundedRect(0, 0, width, height, borderRadius);
            } else {
                this.drawRect(0, 0, width, height);
            }
        }
    }
}