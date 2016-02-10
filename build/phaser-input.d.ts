declare module Fabrique {
    interface InputOptions extends Phaser.PhaserTextStyle {
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
        placeHolderColor?: string;
        type?: InputType;
    }
    enum InputType {
        text = 0,
        password = 1,
    }
    class InputField extends Phaser.Sprite {
        placeHolder: Phaser.Text;
        box: Phaser.Graphics;
        private focus;
        private cursor;
        text: Phaser.Text;
        type: InputType;
        value: string;
        private registered;
        private shift;
        private padding;
        private callback;
        private id;
        constructor(game: Phaser.Game, x: number, y: number, inputOptions: InputOptions);
        private createBox(inputOptions);
        /**
         * This is a generic input down handler for the game.
         * if the input object is clicked, we gain focus on it and create the dom element
         *
         * If there was focus on the element previously, but clicked outside of it, the element will loose focus
         * and no keyboard events will be registered anymore
         *
         * @param e Phaser.Pointer
         */
        private checkDown(e);
        /**
         * Creates a hidden input field, makes sure focus is added to it.
         * This is all to ensure mobile keyboard are also opened
         *
         * And last, but not least, we register an event handler
         */
        private createDomElement();
        /**
         * Removes the hidden input field and the key eventlistener
         */
        private removeDomElement();
        /**
         * Update function makes the cursor blink, it uses two private properties to make it toggle
         *
         * @returns {number}
         */
        private blink;
        private cnt;
        update(): number;
        /**
         * Focus is lost on the input element, we disable the cursor and remove the hidden input element
         */
        private endFocus();
        /**
         * Update the text value in the box, and make sure the cursor is positioned correctly
         */
        private updateText();
        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
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
