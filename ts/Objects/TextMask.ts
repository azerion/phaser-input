module Fabrique {
    export class TextMask extends Phaser.Graphics {
        constructor(game: Phaser.Game, inputOptions: InputOptions) {
            super(game, inputOptions.padding, inputOptions.padding);

            var borderRadius = inputOptions.borderRadius,
                height = inputOptions.height;

            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            var width = inputOptions.width;

            this.beginFill(0x000000);

            if (borderRadius > 0) {
                this.drawRoundedRect(0, 0, width, height, borderRadius);
            } else {
                this.drawRect(0, 0, width, height);
            }
        }
    }
}