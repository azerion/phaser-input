declare module Fabrique {
    interface InputOptions extends Phaser.PhaserTextStyle {
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
    class Input extends Phaser.Sprite {
        placeHolder: Phaser.Text;
        box: Phaser.Graphics;
        private focus;
        private cursor;
        value: Phaser.Text;
        private text;
        constructor(game: Phaser.Game, x: number, y: number, inputOptions: InputOptions);
        private createBox(inputOptions);
        private onClick();
        private blink;
        private cnt;
        update(): number;
        onKeyPress(): void;
    }
}
