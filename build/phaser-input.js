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
            this.padding = inputOptions.padding || 0;
            this.createBox(inputOptions);
            if (inputOptions.placeHolder && inputOptions.placeHolder.length > 0) {
                this.placeHolder = new Phaser.Text(game, this.padding, this.padding, inputOptions.placeHolder, {
                    font: inputOptions.font || '14px Arial',
                    fontWeight: inputOptions.fontWeight || 'normal',
                    fill: inputOptions.placeHolderColor || '#bfbebd'
                });
                this.addChild(this.placeHolder);
            }
            this.cursor = new Phaser.Text(game, this.padding, this.padding - 2, '|', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            this.cursor.visible = false;
            this.addChild(this.cursor);
            this.text = new Phaser.Text(game, this.padding, this.padding, '', {
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
            height = this.padding * 2 + height;
            var width = inputOptions.width || 150;
            width = this.padding * 2 + width;
            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, 1)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, 1)
                .drawRoundedRect(0, 0, width, height, inputOptions.borderRadius || 3);
            this.addChild(this.box);
        };
        InputField.prototype.checkDown = function (e) {
            if (this.input.checkPointerOver(e)) {
                this.focus = true;
                this.placeHolder.visible = false;
                this.createDomElement();
            }
            else {
                if (this.focus === true) {
                    this.endFocus();
                }
            }
        };
        InputField.prototype.createDomElement = function () {
            var _this = this;
            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'hack';
            input.style.position = 'absolute';
            input.style.top = (-100).toString() + 'px';
            input.style.left = (-100).toString() + 'px';
            input.value = this.value;
            document.body.appendChild(input);
            //chrome/safari hack/bugfix
            setTimeout(function () {
                input.focus();
            }, 0);
            this.callback = function () { return _this.keyListener(); };
            document.addEventListener('keyup', this.callback);
        };
        InputField.prototype.removeDomElement = function () {
            var input = document.getElementById('hack');
            document.body.removeChild(input);
            document.removeEventListener('keyup', this.callback);
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
        InputField.prototype.onKeyPress = function (key) {
            if (!this.focus) {
                return;
            }
            var s = String.fromCharCode(key.keyCode);
            this.value += (this.shift.isDown) ? s : s.toLowerCase();
            this.updateText();
        };
        InputField.prototype.endFocus = function () {
            this.focus = false;
            if (this.value.length === 0) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;
            this.removeDomElement();
        };
        InputField.prototype.updateText = function () {
            this.text.setText(this.value);
            this.cursor.x = this.text.width + this.padding;
        };
        InputField.prototype.keyListener = function () {
            this.value = document.getElementById('hack').value;
            this.updateText();
        };
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