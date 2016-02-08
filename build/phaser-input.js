var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fabrique;
(function (Fabrique) {
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(game, x, y, inputOptions) {
            _super.call(this, game, x, y);
            this.placeHolder = null;
            this.box = null;
            this.focus = false;
            this.text = '';
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
            this.value = new Phaser.Text(game, inputOptions.padding || 0, (inputOptions.padding || 0), '', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.placeHolderColor || '#000000'
            });
            this.addChild(this.value);
            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.events.onInputDown.add(this.onClick, this);
        }
        Input.prototype.createBox = function (inputOptions) {
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
        Input.prototype.onClick = function () {
            var _this = this;
            this.focus = true;
            this.game.input.keyboard.onDownCallback = function () {
                _this.onKeyPress();
            };
        };
        Input.prototype.update = function () {
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
        Input.prototype.onKeyPress = function () {
            if (!this.focus) {
                return;
            }
            this.text += String.fromCharCode(this.game.input.keyboard.event.keyCode);
            this.value.setText(this.text);
            this.cursor.x = this.value.width;
        };
        return Input;
    })(Phaser.Sprite);
    Fabrique.Input = Input;
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-input.js.map