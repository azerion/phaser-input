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
    class InputField extends Phaser.Sprite {
        placeHolder: Phaser.Text;
        box: Phaser.Graphics;
        private focus;
        private cursor;
        text: Phaser.Text;
        private value;
        private registered;
        private shift;
        private padding;
        private callback;
        constructor(game: Phaser.Game, x: number, y: number, inputOptions: InputOptions);
        private createBox(inputOptions);
        private checkDown(e);
        private createDomElement();
        private removeDomElement();
        private blink;
        private cnt;
        update(): number;
        private onKeyPress(key);
        private endFocus();
        private updateText();
        private keyListener();
    }
}
declare module Fabrique {
    module Plugins {
        interface InputFieldObjectFactory extends Phaser.GameObjectFactory {
            inputField: (x: number, y: number, inputOptions: Fabrique.InputOptions, group?: Phaser.Group) => Fabrique.InputField;
        }
        interface InputFieldObjectCreator extends Phaser.GameObjectCreator {
            inputField: (x: number, y: number, inputOptions: Fabrique.InputOptions) => Fabrique.InputField;
        }
        interface InputFieldGame extends Phaser.Game {
            add: InputFieldObjectFactory;
            make: InputFieldObjectCreator;
        }
        class InputField extends Phaser.Plugin {
            constructor(game: Phaser.Game, parent: PIXI.DisplayObject);
            /**
             * Extends the GameObjectFactory prototype with the support of adding InputField. this allows us to add InputField methods to the game just like any other object:
             * game.add.InputField();
             */
            private addInputFieldFactory();
        }
    }
}
