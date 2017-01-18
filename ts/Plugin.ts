module PhaserInput {
    export var Zoomed: boolean = false;
    export var KeyboardOpen: boolean = false;
    export const onKeyboardOpen: Phaser.Signal = new Phaser.Signal();
    export const onKeyboardClose: Phaser.Signal = new Phaser.Signal()

    export interface InputFieldObjectFactory extends Phaser.GameObjectFactory {
        inputField: (x: number, y: number, inputOptions?: PhaserInput.InputOptions, group?: Phaser.Group) => PhaserInput.InputField;
    }

    export interface InputFieldObjectCreator extends Phaser.GameObjectCreator {
        inputField: (x: number, y: number, inputOptions?: PhaserInput.InputOptions) => PhaserInput.InputField;
    }

    export interface InputFieldGame extends Phaser.Game {
        add: InputFieldObjectFactory;
        make: InputFieldObjectCreator;
    }

    export class Plugin extends Phaser.Plugin {
        public static Zoomed: boolean = false;
        public static KeyboardOpen: boolean = false;
        public static onKeyboardOpen: Phaser.Signal = new Phaser.Signal();
        public static onKeyboardClose: Phaser.Signal = new Phaser.Signal();

        constructor(game: Phaser.Game, parent: Phaser.PluginManager) {
            super(game, parent);

            this.addInputFieldFactory();
        }

        /**
         * Extends the GameObjectFactory prototype with the support of adding InputField. this allows us to add InputField methods to the game just like any other object:
         * game.add.InputField();
         */
        private addInputFieldFactory() {
            (<PhaserInput.InputFieldObjectFactory>Phaser.GameObjectFactory.prototype).inputField = function (x: number, y: number, inputOptions: PhaserInput.InputOptions, group?: Phaser.Group): PhaserInput.InputField {
                if (group === undefined) {
                    group = this.world;
                }

                var nineSliceObject = new PhaserInput.InputField(this.game, x, y, inputOptions);

                return group.add(nineSliceObject);
            };

            (<PhaserInput.InputFieldObjectCreator>Phaser.GameObjectCreator.prototype).inputField = function (x: number, y: number, inputOptions: PhaserInput.InputOptions): PhaserInput.InputField {
                return new PhaserInput.InputField(this.game, x, y, inputOptions);
            };
        }

    }
}
