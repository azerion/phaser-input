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
        blockKeyDownEvents(): void;
        private preventKeyPropagation(evt);
        unblockKeyDownEvents(): void;
        removeEventListener(): void;
        destroy(): void;
        setMax(max: string, min?: string): void;
        value: string;
        focus(): void;
        blur(): void;
        readonly hasSelection: boolean;
        readonly caretStart: number;
        readonly caretEnd: number;
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
        private checkDown(e);
        private blink;
        private cnt;
        update(): number;
        endFocus(): void;
        startFocus(): void;
        private keyUpProcessor();
        private updateText();
        private updateCursor();
        private getCaretPosition();
        private setCaretOnclick(e);
        private updateSelection();
        private zoomIn();
        private zoomOut();
        private keyListener(evt);
        destroy(destroyChildren?: boolean): void;
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
            private addInputFieldFactory();
        }
    }
}
