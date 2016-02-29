var Fabrique;
(function (Fabrique) {
    (function (InputType) {
        InputType[InputType["text"] = 0] = "text";
        InputType[InputType["password"] = 1] = "password";
        InputType[InputType["number"] = 2] = "number";
    })(Fabrique.InputType || (Fabrique.InputType = {}));
    var InputType = Fabrique.InputType;
    var InputElement = (function () {
        function InputElement(id, type, value) {
            if (type === void 0) { type = InputType.text; }
            if (value === void 0) { value = ''; }
            this.id = id;
            this.type = type;
            this.element = document.createElement('input');
            this.element.id = id;
            this.element.style.position = 'absolute';
            this.element.style.top = (-100).toString() + 'px';
            this.element.style.left = (-100).toString() + 'px';
            this.element.value = this.value;
            this.element.type = InputType[type];
            document.body.appendChild(this.element);
        }
        InputElement.prototype.addKeyUpListener = function (callback) {
            this.callback = callback;
            document.addEventListener('keyup', this.callback);
        };
        InputElement.prototype.removeEventListener = function () {
            document.removeEventListener('keyup', this.callback);
        };
        InputElement.prototype.destroy = function () {
            document.body.removeChild(this.element);
        };
        InputElement.prototype.setMax = function (max, min) {
            if (max === undefined) {
                return;
            }
            if (this.type === InputType.text || this.type === InputType.password) {
                this.element.maxLength = parseInt(max, 10);
            }
            else if (this.type === InputType.number) {
                this.element.max = max;
                if (min === undefined) {
                    return;
                }
                this.element.min = min;
            }
        };
        Object.defineProperty(InputElement.prototype, "value", {
            get: function () {
                return this.element.value;
            },
            set: function (value) {
                this.element.value = value;
            },
            enumerable: true,
            configurable: true
        });
        InputElement.prototype.focus = function () {
            this.element.focus();
        };
        InputElement.prototype.getCaretPosition = function () {
            if (this.type === InputType.number) {
                return -1;
            }
            return this.element.selectionStart;
        };
        return InputElement;
    })();
    Fabrique.InputElement = InputElement;
})(Fabrique || (Fabrique = {}));
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
            if (inputOptions === void 0) { inputOptions = {}; }
            _super.call(this, game, x, y);
            this.placeHolder = null;
            this.box = null;
            this.focus = false;
            this.value = '';
            /**
             * Update function makes the cursor blink, it uses two private properties to make it toggle
             *
             * @returns {number}
             */
            this.blink = true;
            this.cnt = 0;
            //Parse the options
            this.inputOptions = inputOptions;
            this.inputOptions.width = inputOptions.width || 150;
            this.inputOptions.padding = inputOptions.padding || 0;
            this.inputOptions.textAlign = inputOptions.textAlign || 'left';
            this.inputOptions.type = inputOptions.type || Fabrique.InputType.text;
            this.inputOptions.borderRadius = inputOptions.borderRadius || 0;
            this.inputOptions.height = inputOptions.height || 14;
            this.inputOptions.fillAlpha = inputOptions.fillAlpha || 1;
            //create the input box
            this.box = new Fabrique.InputBox(this.game, inputOptions);
            this.setTexture(this.box.generateTexture());
            //create the mask that will be used for the texts
            this.textMask = new Fabrique.TextMask(this.game, inputOptions);
            this.addChild(this.textMask);
            //Create the hidden dom elements
            this.domElement = new Fabrique.InputElement('phaser-input-' + (Math.random() * 10000 | 0).toString(), this.inputOptions.type, this.value);
            this.domElement.setMax(this.inputOptions.max, this.inputOptions.min);
            if (inputOptions.placeHolder && inputOptions.placeHolder.length > 0) {
                this.placeHolder = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding, inputOptions.placeHolder, {
                    font: inputOptions.font || '14px Arial',
                    fontWeight: inputOptions.fontWeight || 'normal',
                    fill: inputOptions.placeHolderColor || '#bfbebd'
                });
                this.placeHolder.mask = this.textMask;
                this.addChild(this.placeHolder);
            }
            this.cursor = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding - 2, '|', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.cursorColor || '#000000'
            });
            this.cursor.visible = false;
            this.addChild(this.cursor);
            this.text = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding, '', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            this.text.mask = this.textMask;
            this.addChild(this.text);
            this.offscreenText = new Phaser.Text(game, this.inputOptions.padding, this.inputOptions.padding, '', {
                font: inputOptions.font || '14px Arial',
                fontWeight: inputOptions.fontWeight || 'normal',
                fill: inputOptions.fill || '#000000'
            });
            switch (this.inputOptions.textAlign) {
                case 'left':
                    this.text.anchor.set(0, 0);
                    this.cursor.x = this.inputOptions.padding + this.getCaretPosition();
                    break;
                case 'center':
                    this.text.anchor.set(0.5, 0);
                    this.text.x += this.inputOptions.width / 2;
                    this.cursor.x = this.inputOptions.padding + this.inputOptions.width / 2 - this.text.width / 2 + this.getCaretPosition();
                    break;
                case 'right':
                    this.text.anchor.set(1, 0);
                    this.text.x += this.inputOptions.width;
                    this.cursor.x = this.inputOptions.padding + this.inputOptions.width;
                    break;
            }
            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.game.input.onDown.add(this.checkDown, this);
        }
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
                if (null !== this.placeHolder) {
                    this.placeHolder.visible = false;
                }
                this.startFocus();
            }
            else {
                if (this.focus === true) {
                    this.endFocus();
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
        /**
         * Focus is lost on the input element, we disable the cursor and remove the hidden input element
         */
        InputField.prototype.endFocus = function () {
            this.domElement.removeEventListener();
            this.focus = false;
            if (this.value.length === 0 && null !== this.placeHolder) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;
        };
        InputField.prototype.startFocus = function () {
            var _this = this;
            this.domElement.addKeyUpListener(this.keyListener.bind(this));
            if (this.game.device.desktop) {
                //Timeout is a chrome hack
                setTimeout(function () {
                    _this.domElement.focus();
                }, 0);
            }
            else {
                this.domElement.focus();
            }
        };
        /**
         * Update the text value in the box, and make sure the cursor is positioned correctly
         */
        InputField.prototype.updateText = function () {
            var text = '';
            if (this.inputOptions.type === Fabrique.InputType.password) {
                for (var i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            }
            else if (this.inputOptions.type === Fabrique.InputType.number) {
                var val = parseInt(this.value);
                if (val < parseInt(this.inputOptions.min)) {
                    text = this.inputOptions.min;
                }
                else if (val > parseInt(this.inputOptions.max)) {
                    text = this.inputOptions.max;
                }
                else {
                    text = this.value;
                }
            }
            else {
                text = this.value;
            }
            this.text.setText(text);
            if (this.text.width > this.inputOptions.width) {
                this.text.anchor.x = 1;
                this.text.x = this.inputOptions.padding + this.inputOptions.width;
            }
            else {
                switch (this.inputOptions.textAlign) {
                    case 'left':
                        this.text.anchor.set(0, 0);
                        this.text.x = this.inputOptions.padding;
                        break;
                    case 'center':
                        this.text.anchor.set(0.5, 0);
                        this.text.x = this.inputOptions.padding + this.inputOptions.width / 2;
                        break;
                    case 'right':
                        this.text.anchor.set(1, 0);
                        this.text.x = this.inputOptions.padding + this.inputOptions.width;
                        break;
                }
            }
        };
        /**
         * Updates the position of the caret in the phaser input field
         */
        InputField.prototype.updateCursor = function () {
            if (this.text.width > this.inputOptions.width || this.inputOptions.textAlign === 'right') {
                this.cursor.x = this.inputOptions.padding + this.inputOptions.width;
            }
            else {
                switch (this.inputOptions.textAlign) {
                    case 'left':
                        this.cursor.x = this.inputOptions.padding + this.getCaretPosition();
                        break;
                    case 'center':
                        this.cursor.x = this.inputOptions.padding + this.inputOptions.width / 2 - this.text.width / 2 + this.getCaretPosition();
                        break;
                }
            }
        };
        /**
         * Fetches the carrot position from the dom element. This one changes when you use the keyboard to navigate the element
         *
         * @returns {number}
         */
        InputField.prototype.getCaretPosition = function () {
            var caretPosition = this.domElement.getCaretPosition();
            if (-1 === caretPosition) {
                return this.text.width;
            }
            var text = this.value;
            if (this.inputOptions.type === Fabrique.InputType.password) {
                text = '';
                for (var i = 0; i < this.value.length; i++) {
                    text += '*';
                }
            }
            this.offscreenText.setText(text.slice(0, caretPosition));
            return this.offscreenText.width;
        };
        /**
         * Event fired when a key is pressed, it takes the value from the hidden input field and adds it as its own
         */
        InputField.prototype.keyListener = function () {
            this.value = this.domElement.value;
            this.updateText();
            this.updateCursor();
        };
        /**
         * We overwrite the destroy method because we want to delete the (hidden) dom element when the inputField was removed
         */
        InputField.prototype.destroy = function () {
            this.domElement.destroy();
            _super.prototype.destroy.call(this);
        };
        /**
         * Resets the text to an empty value
         */
        InputField.prototype.resetText = function () {
            this.value = "";
            this.domElement.value = this.value;
            this.updateText();
            this.updateCursor();
            this.endFocus();
        };
        return InputField;
    })(Phaser.Sprite);
    Fabrique.InputField = InputField;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var InputBox = (function (_super) {
        __extends(InputBox, _super);
        function InputBox(game, inputOptions) {
            _super.call(this, game, 0, 0);
            var bgColor = (inputOptions.backgroundColor) ? parseInt(inputOptions.backgroundColor.slice(1), 16) : 0xffffff, borderRadius = inputOptions.borderRadius || 0, borderColor = (inputOptions.borderColor) ? parseInt(inputOptions.borderColor.slice(1), 16) : 0x959595, alpha = inputOptions.fillAlpha, height = inputOptions.height;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            height = inputOptions.padding * 2 + height;
            var width = inputOptions.width;
            width = inputOptions.padding * 2 + width;
            this.beginFill(bgColor, alpha)
                .lineStyle(inputOptions.borderWidth || 1, borderColor, alpha);
            if (borderRadius > 0) {
                this.drawRoundedRect(0, 0, width, height, borderRadius);
            }
            else {
                this.drawRect(0, 0, width, height);
            }
        }
        return InputBox;
    })(Phaser.Graphics);
    Fabrique.InputBox = InputBox;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var TextMask = (function (_super) {
        __extends(TextMask, _super);
        function TextMask(game, inputOptions) {
            _super.call(this, game, inputOptions.padding, inputOptions.padding);
            var borderRadius = inputOptions.borderRadius, height = inputOptions.height;
            if (inputOptions.font) {
                //fetch height from font;
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            var width = inputOptions.width;
            this.beginFill(0x000000);
            if (borderRadius > 0) {
                this.drawRoundedRect(0, 0, width, height, borderRadius);
            }
            else {
                this.drawRect(0, 0, width, height);
            }
        }
        return TextMask;
    })(Phaser.Graphics);
    Fabrique.TextMask = TextMask;
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