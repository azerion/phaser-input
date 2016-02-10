/*!
 * phaser-input - version 0.0.4 
 * Adds input boxes to Phaser like CanvasInput, but also works for WebGL.
 *
 * OrangeGames
 * Build at 10-02-2016
 * Released under MIT License 
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fabrique;
(function (Fabrique) {
    (function (InputType) {
        InputType[InputType["text"] = 0] = "text";
        InputType[InputType["password"] = 1] = "password";
    })(Fabrique.InputType || (Fabrique.InputType = {}));
    var InputType = Fabrique.InputType;
    var InputField = (function (_super) {
        __extends(InputField, _super);
        function InputField(game, x, y, inputOptions) {
            _super.call(this, game, x, y);
            this.placeHolder = null;
            this.box = null;
            this.focus = false;
            this.type = InputType.text;
            this.value = '';
            this.id = 'phaser-input-' + (Math.random() * 10000 | 0).toString();
            /**
             * Update function makes the cursor blink, it uses two private properties to make it toggle
             *
             * @returns {number}
             */
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
            if (inputOptions.type) {
                this.type = inputOptions.type;
            }
            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.game.input.onDown.add(this.checkDown, this);
        }
        InputField.prototype.createBox = function (inputOptions) {
            var bgColor = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff;
            var borderColor = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595;
            var alpha = (inputOptions.fillAlpha !== undefined) ? inputOptions.fillAlpha : 1;
            var height = inputOptions.height || 14;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            height = this.padding * 2 + height;
            var width = inputOptions.width || 150;
            width = this.padding * 2 + width;
            this.box = new Phaser.Graphics(this.game, 0, 0);
            this.box.beginFill(bgColor, alpha)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, alpha)
                .drawRoundedRect(0, 0, width, height, inputOptions.borderRadius || 3);
            this.addChild(this.box);
        };
        /**
         * This is a generic input down handler for the game.
         * if the input object is clicked, we gain focus on it and create the dom element
         *
         * If there was focus on the element previously, but clicked outside of it, the element will loose focus
         * and no keyboard events will be registered anymore
         *
         * @param e Phaser.Pointer
         */
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
        /**
         * Creates a hidden input field, makes sure focus is added to it.
         * This is all to ensure mobile keyboard are also opened
         *
         * And last, but not least, we register an event handler
         */
        InputField.prototype.createDomElement = function () {
            var _this = this;
            var input = document.getElementById(this.id);
            var created = false;
            if (null === input) {
                input = document.createElement('input');
                created = true;
            }
            input.id = this.id;
            //input.id = 'hack';
            input.style.position = 'absolute';
            input.style.top = (-100).toString() + 'px';
            input.style.left = (-100).toString() + 'px';
            input.value = this.value;
            if (this.type === InputType.password) {
                input.type = 'password';
            }
            else {
                input.type = 'text';
            }
            if (created) {
                document.body.appendChild(input);
            }
            //chrome/safari hack/bugfix
            setTimeout(function () {
                input.focus();
            }, 10);
            this.callback = function () { return _this.keyListener(); };
            document.addEventListener('keyup', this.callback);
        };
        /**
         * Removes the hidden input field and the key eventlistener
         */
        InputField.prototype.removeDomElement = function () {
            var input = document.getElementById(this.id);
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
        /**
         * Focus is lost on the input element, we disable the cursor and remove the hidden input element
         */
        InputField.prototype.endFocus = function () {
            this.focus = false;
            if (this.value.length === 0) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;
            this.removeDomElement();
        };
        /**
         * Update the text value in the box, and make sure the cursor is positioned correctly
         */
        InputField.prototype.updateText = function () {
            var text = '';
            if (this.type === InputType.password) {
                for (var i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            }
            else {
                text = this.value;
            }
            this.text.setText(text);
            this.cursor.x = this.text.width + this.padding;
        };
        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
        InputField.prototype.keyListener = function () {
            this.value = document.getElementById(this.id).value;
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