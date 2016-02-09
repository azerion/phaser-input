var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fabrique;
(function (Fabrique) {
    var InputField = (function (_super) {
        __extends(InputField, _super);
        function InputField(game, x, y, inputOptions) {
            _super.call(this, game, x, y);
            this.placeHolder = null;
            this.box = null;
            this.focus = false;
            this.value = '';
            this.blink = true;
            this.cnt = 0;
            this.createBox(inputOptions);
            if (inputOptions.placeHolder && inputOptions.placeHolder.length > 0) {
                console.log(inputOptions);
                this.placeHolder = new Phaser.Text(game, inputOptions.padding || 0, inputOptions.padding || 0, inputOptions.placeHolder, {
                    font: inputOptions.font || '14px Arial',
                    fontWeight: inputOptions.fontWeight || 'normal',
                    fill: inputOptions.placeHolderColor || '#bfbebd'
                });
                this.addChild(this.placeHolder);
            }
            this.cursor = new Phaser.Text(game, inputOptions.padding || 0, (inputOptions.padding || 0) - 2, '|', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            this.cursor.visible = false;
            this.addChild(this.cursor);
            this.text = new Phaser.Text(game, inputOptions.padding || 0, (inputOptions.padding || 0), '', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.placeHolderColor || '#000000'
            });
            this.addChild(this.text);
            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.game.input.onDown.add(this.checkDown, this);
        }
        InputField.prototype.createBox = function (inputOptions) {
            var bgColor = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff;
            var borderColor = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595;
            var height = inputOptions.height || 14;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            height = (inputOptions.padding) ? inputOptions.padding * 2 + height : height;
            var width = inputOptions.width || 150;
            width = (inputOptions.padding) ? inputOptions.padding * 2 + width : width;
            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, 1)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, 1)
                .drawRoundedRect(0, 0, width, height, inputOptions.borderRadius || 3);
            this.addChild(this.box);
        };
        InputField.prototype.checkDown = function (e) {
            var _this = this;
            if (this.input.checkPointerOver(e)) {
                this.focus = true;
                this.game.input.keyboard.onDownCallback = function () {
                    _this.onKeyPress();
                };
                this.placeHolder.visible = false;
            }
            else {
                this.focus = false;
                if (this.value.length === 0) {
                    this.placeHolder.visible = true;
                    this.cursor.visible = false;
                }
            }
        };
        InputField.prototype.update = function () {
            if (!this.focus) {
                return;
            }
            if (this.cnt !== 30) {
                return this.cnt++;
            }
            this.cursor.visible = this.blink;
            this.blink = !this.blink;
            this.cnt = 0;
        };
        InputField.prototype.onKeyPress = function () {
            if (!this.focus) {
                return;
            }
            this.value += String.fromCharCode(this.game.input.keyboard.event.keyCode);
            this.text.setText(this.value);
            this.cursor.x = this.text.width;
        };
        InputField.ALLOWED_CHARACTERS = [
            Phaser.Keyboard.A,
            Phaser.Keyboard.B,
            Phaser.Keyboard.C,
            Phaser.Keyboard.D,
            Phaser.Keyboard.E,
            Phaser.Keyboard.F,
            Phaser.Keyboard.G,
            Phaser.Keyboard.H,
            Phaser.Keyboard.I,
            Phaser.Keyboard.J,
            Phaser.Keyboard.K,
            Phaser.Keyboard.L,
            Phaser.Keyboard.M,
            Phaser.Keyboard.N,
            Phaser.Keyboard.O,
            Phaser.Keyboard.P,
            Phaser.Keyboard.Q,
            Phaser.Keyboard.R,
            Phaser.Keyboard.S,
            Phaser.Keyboard.T,
            Phaser.Keyboard.U,
            Phaser.Keyboard.V,
            Phaser.Keyboard.W,
            Phaser.Keyboard.X,
            Phaser.Keyboard.Y,
            Phaser.Keyboard.Z,
            Phaser.Keyboard.ZERO,
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.THREE,
            Phaser.Keyboard.FOUR,
            Phaser.Keyboard.FIVE,
            Phaser.Keyboard.SIX,
            Phaser.Keyboard.SEVEN,
            Phaser.Keyboard.EIGHT,
            Phaser.Keyboard.NINE,
        ];
        return InputField;
    })(Phaser.Sprite);
    Fabrique.InputField = InputField;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var Plugins;
    (function (Plugins) {
        var InputField = (function (_super) {
            __extends(InputField, _super);
            function InputField(game, parent) {
                _super.call(this, game, parent);
                this.addInputFieldFactory();
            }
            /**
             * Extends the GameObjectFactory prototype with the support of adding InputField. this allows us to add InputField methods to the game just like any other object:
             * game.add.InputField();
             */
            InputField.prototype.addInputFieldFactory = function () {
                Phaser.GameObjectFactory.prototype.inputField = function (x, y, inputOptions, group) {
                    if (group === undefined) {
                        group = this.world;
                    }
                    var nineSliceObject = new Fabrique.InputField(this.game, x, y, inputOptions);
                    return group.add(nineSliceObject);
                };
                Phaser.GameObjectCreator.prototype.inputField = function (x, y, inputOptions) {
                    return new Fabrique.InputField(this.game, x, y, inputOptions);
                };
            };
            return InputField;
        })(Phaser.Plugin);
        Plugins.InputField = InputField;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-input.js.map