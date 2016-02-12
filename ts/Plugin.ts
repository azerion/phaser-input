module Fabrique {
    export module Plugins {
        export interface InputFieldObjectFactory extends Phaser.GameObjectFactory {
            inputField: (x:number, y:number, inputOptions?: Fabrique.InputOptions, group?:Phaser.Group) => Fabrique.InputField;
        }

        export interface InputFieldObjectCreator extends Phaser.GameObjectCreator {
            inputField: (x:number, y:number, inputOptions?: Fabrique.InputOptions) => Fabrique.InputField;
        }

        export interface InputFieldGame extends Phaser.Game {
            add: InputFieldObjectFactory;
            make: InputFieldObjectCreator;
        }

        export class InputField extends Phaser.Plugin {
            constructor(game:Phaser.Game, parent:PIXI.DisplayObject) {
                super(game, parent);

                this.addInputFieldFactory();
            }

            /**
             * Extends the GameObjectFactory prototype with the support of adding InputField. this allows us to add InputField methods to the game just like any other object:
             * game.add.InputField();
             */
            private addInputFieldFactory() {
                (<Fabrique.Plugins.InputFieldObjectFactory>Phaser.GameObjectFactory.prototype).inputField = function (x:number, y:number, inputOptions: Fabrique.InputOptions, group?:Phaser.Group):Fabrique.InputField {
                    if (group === undefined) {
                        group = this.world;
                    }

                    var nineSliceObject = new Fabrique.InputField(this.game, x, y, inputOptions);

                    return group.add(nineSliceObject);
                };

                (<Fabrique.Plugins.InputFieldObjectCreator>Phaser.GameObjectCreator.prototype).inputField = function (x:number, y:number, inputOptions: Fabrique.InputOptions):Fabrique.InputField {
                    return new Fabrique.InputField(this.game, x, y, inputOptions);
                };
            }

        }
    }
}
