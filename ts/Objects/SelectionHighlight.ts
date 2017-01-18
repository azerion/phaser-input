module PhaserInput {
    export class SelectionHighlight extends Phaser.Graphics {
        private inputOptions: InputOptions;

        constructor(game: Phaser.Game, inputOptions: InputOptions) {
            super(game, inputOptions.padding, inputOptions.padding);

            this.inputOptions = inputOptions;
        }

        public updateSelection(rect: PIXI.Rectangle): void {
            var color = Phaser.Color.webToColor(this.inputOptions.selectionColor);

            this.clear();
            this.beginFill(SelectionHighlight.rgb2hex(color), color.a);
            this.drawRect(rect.x, rect.y, rect.width, rect.height - this.inputOptions.padding);
        }

        public static rgb2hex(color: {r: number, g: number, b: number, a: number}): number {
            return parseInt(("0" + color.r.toString(16)).slice(-2) +
                ("0" + color.g.toString(16)).slice(-2) +
                ("0" + color.b.toString(16)).slice(-2), 16);
        }
    }
}