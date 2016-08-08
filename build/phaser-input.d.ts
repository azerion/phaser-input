declare module Fabrique {
    enum InputType {
        text = 0,
        password = 1,
        number = 2,
    }
    class InputElement {
        private element;
        private callback;
        private type;
        private id;
        private game;
        focusIn: Phaser.Signal;
        focusOut: Phaser.Signal;
        constructor(game: Phaser.Game, id: string, type?: InputType, value?: string);
        addKeyUpListener(callback: () => void): void;
        /**
         * Captures the keyboard event on keydown, used to prevent it going from input field to sprite
         **/
        blockKeyDownEvents(): void;
        /**
        * To prevent bubbling of keyboard event from input field to sprite
        **/
        private preventKeyPropagation(evt);
        /**
         * Remove listener that captures keydown keyboard events
         **/
        unblockKeyDownEvents(): void;
        removeEventListener(): void;
        destroy(): void;
        setMax(max: string, min?: string): void;
        value: string;
        focus(): void;
        blur(): void;
        hasSelection: boolean;
        caretStart: number;
        caretEnd: number;
        getCaretPosition(): number;
        setCaretPosition(pos: number): void;
    }
}
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
        cursorColor?: string;
        placeHolderColor?: string;
        type?: InputType;
        min?: string;
        max?: string;
        textAlign?: string;
        selectionColor?: string;
        zoom?: boolean;
    }
    class InputField extends Phaser.Sprite {
        focusOutOnEnter: boolean;
        private placeHolder;
        private box;
        private textMask;
        private focus;
        private cursor;
        private text;
        private offscreenText;
        value: string;
        private inputOptions;
        private domElement;
        private selection;
        private windowScale;
        blockInput: boolean;
        constructor(game: Phaser.Game, x: number, y: number, inputOptions?: InputOptions);
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
        endFocus(): void;
        /**
         *
         */
        startFocus(): void;
        private keyUpProcessor();
        /**
         * Update the text value in the box, and make sure the cursor is positioned correctly
         */
        private updateText();
        /**
         * Updates the position of the caret in the phaser input field
         */
        private updateCursor();
        /**
         * Fetches the carrot position from the dom element. This one changes when you use the keyboard to navigate the element
         *
         * @returns {number}
         */
        private getCaretPosition();
        /**
         * Set the caret when a click was made in the input field
         *
         * @param e
         */
        private setCaretOnclick(e);
        /**
         * This checks if a select has been made, and if so highlight it with blue
         */
        private updateSelection();
        private zoomIn();
        private zoomOut();
        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
        private keyListener(evt);
        /**
         * We overwrite the destroy method because we want to delete the (hidden) dom element when the inputField was removed
         */
        destroy(destroyChildren?: boolean): void;
        /**
         * Resets the text to an empty value
         */
        resetText(): void;
        setText(text?: string): void;
    }
}
declare module Fabrique {
    class InputBox extends Phaser.Graphics {
        constructor(game: Phaser.Game, inputOptions: InputOptions);
    }
}
declare module Fabrique {
    class SelectionHighlight extends Phaser.Graphics {
        private inputOptions;
        constructor(game: Phaser.Game, inputOptions: InputOptions);
        updateSelection(rect: PIXI.Rectangle): void;
        static rgb2hex(color: {
            r: number;
            g: number;
            b: number;
            a: number;
        }): number;
    }
}
declare module Fabrique {
    class TextMask extends Phaser.Graphics {
        constructor(game: Phaser.Game, inputOptions: InputOptions);
    }
}
declare module Fabrique {
    module Plugins {
        interface InputFieldObjectFactory extends Phaser.GameObjectFactory {
            inputField: (x: number, y: number, inputOptions?: Fabrique.InputOptions, group?: Phaser.Group) => Fabrique.InputField;
        }
        interface InputFieldObjectCreator extends Phaser.GameObjectCreator {
            inputField: (x: number, y: number, inputOptions?: Fabrique.InputOptions) => Fabrique.InputField;
        }
        interface InputFieldGame extends Phaser.Game {
            add: InputFieldObjectFactory;
            make: InputFieldObjectCreator;
        }
        class InputField extends Phaser.Plugin {
            static Zoomed: boolean;
            static KeyboardOpen: boolean;
            static onKeyboardOpen: Phaser.Signal;
            static onKeyboardClose: Phaser.Signal;
            constructor(game: Phaser.Game, parent: Phaser.PluginManager);
            /**
             * Extends the GameObjectFactory prototype with the support of adding InputField. this allows us to add InputField methods to the game just like any other object:
             * game.add.InputField();
             */
            private addInputFieldFactory();
        }
    }
}
