/*!
 * phaser-input - version 1.2.6 
 * Adds input boxes to Phaser like CanvasInput, but also works for WebGL and Mobile, made for Phaser only.
 *
 * OrangeGames
 * Build at 14-11-2016
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
        InputType[InputType["number"] = 2] = "number";
    })(Fabrique.InputType || (Fabrique.InputType = {}));
    var InputType = Fabrique.InputType;
    var InputElement = (function () {
        function InputElement(game, id, type, value) {
            var _this = this;
            if (type === void 0) { type = InputType.text; }
            if (value === void 0) { value = ''; }
            this.focusIn = new Phaser.Signal();
            this.focusOut = new Phaser.Signal();
            this.id = id;
            this.type = type;
            this.game = game;
            var canvasTopX = this.game.canvas.getBoundingClientRect().top + document.body.scrollTop;
            this.element = document.createElement('input');
            this.element.id = id;
            this.element.style.position = 'absolute';
            this.element.style.top = canvasTopX + 'px';
            this.element.style.left = (-20).toString() + 'px';
            this.element.style.width = (10).toString() + 'px';
            this.element.style.height = (10).toString() + 'px';
            this.element.value = this.value;
            this.element.type = InputType[type];
            this.element.addEventListener('focusin', function () {
                _this.focusIn.dispatch();
            });
            this.element.addEventListener('focusout', function () {
                _this.focusOut.dispatch();
            });
            document.body.appendChild(this.element);
        }
        InputElement.prototype.addKeyUpListener = function (callback) {
            this.callback = callback;
            document.addEventListener('keyup', this.callback);
        };
        InputElement.prototype.blockKeyDownEvents = function () {
            document.addEventListener('keydown', this.preventKeyPropagation);
        };
        InputElement.prototype.preventKeyPropagation = function (evt) {
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            else {
                event.cancelBubble = true;
            }
        };
        InputElement.prototype.unblockKeyDownEvents = function () {
            document.removeEventListener('keydown', this.preventKeyPropagation);
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
            var _this = this;
            this.element.focus();
            if (!this.game.device.desktop && this.game.device.chrome) {
                var originalWidth_1 = window.innerWidth, originalHeight_1 = window.innerHeight;
                var kbAppeared_1 = false;
                var interval_1 = setInterval(function () {
                    if (originalWidth_1 > window.innerWidth || originalHeight_1 > window.innerHeight) {
                        kbAppeared_1 = true;
                    }
                    if (kbAppeared_1 && originalWidth_1 === window.innerWidth && originalHeight_1 === window.innerHeight) {
                        _this.focusOut.dispatch();
                        clearInterval(interval_1);
                    }
                }, 50);
            }
        };
        InputElement.prototype.blur = function () {
            this.element.blur();
        };
        Object.defineProperty(InputElement.prototype, "hasSelection", {
            get: function () {
                if (this.type === InputType.number) {
                    return false;
                }
                return this.element.selectionStart !== this.element.selectionEnd;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputElement.prototype, "caretStart", {
            get: function () {
                return this.element.selectionEnd;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputElement.prototype, "caretEnd", {
            get: function () {
                return this.element.selectionStart;
            },
            enumerable: true,
            configurable: true
        });
        InputElement.prototype.getCaretPosition = function () {
            if (this.type === InputType.number) {
                return -1;
            }
            return this.element.selectionStart;
        };
        InputElement.prototype.setCaretPosition = function (pos) {
            if (this.type === InputType.number) {
                return;
            }
            this.element.setSelectionRange(pos, pos);
        };
        return InputElement;
    }());
    Fabrique.InputElement = InputElement;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var InputField = (function (_super) {
        __extends(InputField, _super);
        function InputField(game, x, y, inputOptions) {
            var _this = this;
            if (inputOptions === void 0) { inputOptions = {}; }
            _super.call(this, game, x, y);
            this.focusOutOnEnter = true;
            this.placeHolder = null;
            this.box = null;
            this.focus = false;
            this.value = '';
            this.windowScale = 1;
            this.blockInput = true;
            this.blink = true;
            this.cnt = 0;
            this.inputOptions = inputOptions;
            this.inputOptions.width = inputOptions.width || 150;
            this.inputOptions.padding = inputOptions.padding || 0;
            this.inputOptions.textAlign = inputOptions.textAlign || 'left';
            this.inputOptions.type = inputOptions.type || Fabrique.InputType.text;
            this.inputOptions.borderRadius = inputOptions.borderRadius || 0;
            this.inputOptions.height = inputOptions.height || 14;
            this.inputOptions.fillAlpha = (inputOptions.fillAlpha === undefined) ? 1 : inputOptions.fillAlpha;
            this.inputOptions.selectionColor = inputOptions.selectionColor || 'rgba(179, 212, 253, 0.8)';
            this.inputOptions.zoom = (!game.device.desktop) ? inputOptions.zoom || false : false;
            this.box = new Fabrique.InputBox(this.game, inputOptions);
            this.setTexture(this.box.generateTexture());
            this.textMask = new Fabrique.TextMask(this.game, inputOptions);
            this.addChild(this.textMask);
            this.domElement = new Fabrique.InputElement(this.game, 'phaser-input-' + (Math.random() * 10000 | 0).toString(), this.inputOptions.type, this.value);
            this.domElement.setMax(this.inputOptions.max, this.inputOptions.min);
            this.selection = new Fabrique.SelectionHighlight(this.game, this.inputOptions);
            this.selection.mask = this.textMask;
            this.addChild(this.selection);
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
            this.domElement.focusOut.add(function () {
                if (Fabrique.Plugins.InputField.KeyboardOpen) {
                    _this.endFocus();
                    if (_this.inputOptions.zoom) {
                        _this.zoomOut();
                    }
                }
            });
        }
        InputField.prototype.checkDown = function (e) {
            if (!this.value) {
                this.resetText();
            }
            if (this.input.checkPointerOver(e)) {
                if (this.focus) {
                    this.setCaretOnclick(e);
                    return;
                }
                if (this.inputOptions.zoom && !Fabrique.Plugins.InputField.Zoomed) {
                    this.zoomIn();
                }
                this.startFocus();
            }
            else {
                if (this.focus === true) {
                    this.endFocus();
                    if (this.inputOptions.zoom) {
                        this.zoomOut();
                    }
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
        InputField.prototype.endFocus = function () {
            var _this = this;
            if (!this.focus) {
                return;
            }
            this.domElement.removeEventListener();
            if (this.blockInput === true) {
                this.domElement.unblockKeyDownEvents();
            }
            this.focus = false;
            if (this.value.length === 0 && null !== this.placeHolder) {
                this.placeHolder.visible = true;
            }
            this.cursor.visible = false;
            if (this.game.device.desktop) {
                setTimeout(function () {
                    _this.domElement.blur();
                }, 0);
            }
            else {
                this.domElement.blur();
            }
            if (!this.game.device.desktop) {
                Fabrique.Plugins.InputField.KeyboardOpen = false;
                Fabrique.Plugins.InputField.onKeyboardClose.dispatch();
            }
        };
        InputField.prototype.startFocus = function () {
            var _this = this;
            this.focus = true;
            if (null !== this.placeHolder) {
                this.placeHolder.visible = false;
            }
            if (this.game.device.desktop) {
                setTimeout(function () {
                    _this.keyUpProcessor();
                }, 0);
            }
            else {
                this.keyUpProcessor();
            }
            if (!this.game.device.desktop) {
                Fabrique.Plugins.InputField.KeyboardOpen = true;
                Fabrique.Plugins.InputField.onKeyboardOpen.dispatch();
            }
        };
        InputField.prototype.keyUpProcessor = function () {
            this.domElement.addKeyUpListener(this.keyListener.bind(this));
            this.domElement.focus();
            if (this.blockInput === true) {
                this.domElement.blockKeyDownEvents();
            }
        };
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
                    text = this.value = this.domElement.value = this.inputOptions.min;
                }
                else if (val > parseInt(this.inputOptions.max)) {
                    text = this.value = this.domElement.value = this.inputOptions.max;
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
        InputField.prototype.setCaretOnclick = function (e) {
            var localX = (this.text.toLocal(new PIXI.Point(e.x, e.y), this.game.world)).x;
            if (this.inputOptions.textAlign && this.inputOptions.textAlign === 'center') {
                localX += this.text.width / 2;
            }
            var characterWidth = this.text.width / this.value.length;
            var index = 0;
            for (var i = 0; i < this.value.length; i++) {
                if (localX >= i * characterWidth && localX <= (i + 1) * characterWidth) {
                    index = i;
                    break;
                }
            }
            if (localX > (this.value.length - 1) * characterWidth) {
                index = this.value.length;
            }
            this.startFocus();
            this.domElement.setCaretPosition(index);
            this.updateCursor();
        };
        InputField.prototype.updateSelection = function () {
            if (this.domElement.hasSelection) {
                var text = this.value;
                if (this.inputOptions.type === Fabrique.InputType.password) {
                    text = '';
                    for (var i = 0; i < this.value.length; i++) {
                        text += '*';
                    }
                }
                text = text.substring(this.domElement.caretStart, this.domElement.caretEnd);
                this.offscreenText.setText(text);
                this.selection.updateSelection(this.offscreenText.getBounds());
                switch (this.inputOptions.textAlign) {
                    case 'left':
                        this.selection.x = this.inputOptions.padding;
                        break;
                    case 'center':
                        this.selection.x = this.inputOptions.padding + this.inputOptions.width / 2 - this.text.width / 2;
                        break;
                }
            }
            else {
                this.selection.clear();
            }
        };
        InputField.prototype.zoomIn = function () {
            if (Fabrique.Plugins.InputField.Zoomed) {
                return;
            }
            var bounds = this.getBounds();
            if (window.innerHeight > window.innerWidth) {
                this.windowScale = this.game.width / (bounds.width * 1.5);
            }
            else {
                this.windowScale = (this.game.width / 2) / (bounds.width * 1.5);
            }
            var offsetX = ((this.game.width - bounds.width * 1.5) / 2) / this.windowScale;
            this.game.world.scale.set(this.game.world.scale.x * this.windowScale, this.game.world.scale.y * this.windowScale);
            this.game.world.pivot.set(bounds.x - offsetX, bounds.y - this.inputOptions.padding * 2);
            Fabrique.Plugins.InputField.Zoomed = true;
        };
        InputField.prototype.zoomOut = function () {
            if (!Fabrique.Plugins.InputField.Zoomed) {
                return;
            }
            this.game.world.scale.set(this.game.world.scale.x / this.windowScale, this.game.world.scale.y / this.windowScale);
            this.game.world.pivot.set(0, 0);
            Fabrique.Plugins.InputField.Zoomed = false;
        };
        InputField.prototype.keyListener = function (evt) {
            this.value = this.domElement.value;
            if (evt.keyCode === 13) {
                if (this.focusOutOnEnter) {
                    this.endFocus();
                }
                return;
            }
            this.updateText();
            this.updateCursor();
            this.updateSelection();
            evt.preventDefault();
        };
        InputField.prototype.destroy = function (destroyChildren) {
            this.game.input.onDown.remove(this.checkDown, this);
            this.domElement.focusIn.removeAll();
            this.domElement.focusOut.removeAll();
            this.domElement.destroy();
            _super.prototype.destroy.call(this, destroyChildren);
        };
        InputField.prototype.resetText = function () {
            this.setText();
        };
        InputField.prototype.setText = function (text) {
            if (text === void 0) { text = ''; }
            if (null !== this.placeHolder) {
                if (text.length > 0) {
                    this.placeHolder.visible = false;
                }
                else {
                    this.placeHolder.visible = true;
                }
            }
            this.value = text;
            this.domElement.value = this.value;
            this.updateText();
            this.updateCursor();
            this.endFocus();
        };
        return InputField;
    }(Phaser.Sprite));
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
    }(Phaser.Graphics));
    Fabrique.InputBox = InputBox;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var SelectionHighlight = (function (_super) {
        __extends(SelectionHighlight, _super);
        function SelectionHighlight(game, inputOptions) {
            _super.call(this, game, inputOptions.padding, inputOptions.padding);
            this.inputOptions = inputOptions;
        }
        SelectionHighlight.prototype.updateSelection = function (rect) {
            var color = Phaser.Color.webToColor(this.inputOptions.selectionColor);
            this.clear();
            this.beginFill(SelectionHighlight.rgb2hex(color), color.a);
            this.drawRect(rect.x, rect.y, rect.width, rect.height - this.inputOptions.padding);
        };
        SelectionHighlight.rgb2hex = function (color) {
            return parseInt(("0" + color.r.toString(16)).slice(-2) +
                ("0" + color.g.toString(16)).slice(-2) +
                ("0" + color.b.toString(16)).slice(-2), 16);
        };
        return SelectionHighlight;
    }(Phaser.Graphics));
    Fabrique.SelectionHighlight = SelectionHighlight;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var TextMask = (function (_super) {
        __extends(TextMask, _super);
        function TextMask(game, inputOptions) {
            _super.call(this, game, inputOptions.padding, inputOptions.padding);
            var borderRadius = inputOptions.borderRadius, height = inputOptions.height;
            if (inputOptions.font) {
                height = Math.max(parseInt(inputOptions.font.substr(0, inputOptions.font.indexOf('px')), 10), height);
            }
            var width = inputOptions.width;
            height *= 1.3;
            this.beginFill(0x000000);
            this.drawRect(0, 0, width, height);
        }
        return TextMask;
    }(Phaser.Graphics));
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
            InputField.Zoomed = false;
            InputField.KeyboardOpen = false;
            InputField.onKeyboardOpen = new Phaser.Signal();
            InputField.onKeyboardClose = new Phaser.Signal();
            return InputField;
        }(Phaser.Plugin));
        Plugins.InputField = InputField;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-input.js.map